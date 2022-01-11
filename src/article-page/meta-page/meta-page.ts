import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as B from 'fp-ts/boolean';
import { constant, flow, pipe } from 'fp-ts/function';
import striptags from 'striptags';
import { renderMetaContent } from './render-meta-content';
import { renderMetaPage } from './render-meta-page';
import { DomainEvent } from '../../domain-events';
import { ArticleAuthors } from '../../types/article-authors';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { User } from '../../types/user';
import { projectHasUserSavedArticle } from '../project-has-user-saved-article';
import { refereedPreprintBadge } from '../refereed-preprint-badge';
import { renderHeader } from '../render-header';
import { renderSaveArticle } from '../render-save-article';
import { renderTweetThis } from '../render-tweet-this';
import { shouldDisplayRefereedBadge } from '../should-display-refereed-badge';

type MetaPage = (ports: Ports) => (params: Params) => TE.TaskEither<RenderPageError, Page>;

type Params = {
  doi: Doi,
  user: O.Option<User>,
};

type GetArticleDetails = (doi: Doi) => TE.TaskEither<DE.DataError, {
  title: SanitisedHtmlFragment,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  authors: ArticleAuthors,
}>;

type Ports = {
  fetchArticle: GetArticleDetails,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const toErrorPage = (error: DE.DataError) => ({
  type: error,
  message: toHtmlFragment(`
    We’re having trouble finding this information.
    Ensure you have the correct URL, or try refreshing the page.
    You may need to come back later.
  `),
});

export const articleMetaPage: MetaPage = (ports) => (params) => pipe(
  {
    doi: params.doi,
    userId: pipe(params.user, O.map((u) => u.id)),
    tweetThis: pipe(
      params.doi,
      renderTweetThis,
    ),
  },
  ({ doi, userId, tweetThis }) => pipe(
    {
      articleDetails: ports.fetchArticle(doi),
      hasUserSavedArticle: pipe(
        userId,
        O.fold(constant(T.of(false)), (u) => projectHasUserSavedArticle(doi, u)(ports.getAllEvents)),
        TE.rightTask,
      ),
      badge: pipe(
        ports.getAllEvents,
        T.map(flow(
          shouldDisplayRefereedBadge(doi),
          B.fold(() => '', () => refereedPreprintBadge),
          toHtmlFragment,
        )),
        TE.rightTask,
      ),
    },
    sequenceS(TE.ApplyPar),
    TE.map(({ articleDetails, badge, hasUserSavedArticle }) => ({
      doi,
      header: renderHeader({
        articleDetails,
        badge,
        saveArticle: renderSaveArticle(doi, userId, hasUserSavedArticle),
        tweetThis,
      }),
      articleDetails,
      mainContent: renderMetaContent(articleDetails, doi),
    })),
  ),
  TE.bimap(
    toErrorPage,
    (components) => ({
      content: renderMetaPage(components),
      title: striptags(components.articleDetails.title),
      description: striptags(components.articleDetails.abstract),
      openGraph: {
        title: striptags(components.articleDetails.title),
        description: striptags(components.articleDetails.abstract),
      },
    }),
  ),
);
