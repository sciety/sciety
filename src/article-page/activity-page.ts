import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, pipe } from 'fp-ts/function';
import striptags from 'striptags';
import { FindVersionsForArticleDoi, getArticleFeedEventsByDateDescending } from './activity-page/activity-feed/get-article-feed-events';
import { FetchReview } from './activity-page/activity-feed/get-feed-events-content';
import { renderFeed } from './activity-page/activity-feed/render-feed';
import { articleMetaTagContent } from './activity-page/article-meta-tag-content';
import { projectHasUserSavedArticle } from './project-has-user-saved-article';
import { refereedPreprintBadge } from './refereed-preprint-badge';
import { renderAuthorsAndAbstract } from './render-authors-and-abstract';
import { renderDescriptionMetaTagContent } from './render-description-meta-tag-content';
import { renderHeader } from './render-header';
import { renderPage } from './render-page';
import { renderSaveArticle } from './render-save-article';
import { renderTweetThis } from './render-tweet-this';
import { DomainEvent } from '../domain-events';
import { ArticleAuthors } from '../types/article-authors';
import { ArticleServer } from '../types/article-server';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { User } from '../types/user';

type ActivityPage = (ports: Ports) => (params: Params) => TE.TaskEither<RenderPageError, Page>;

type Params = {
  doi: Doi,
  user: O.Option<User>,
};

type GetArticleDetails = (doi: Doi) => TE.TaskEither<DE.DataError, {
  doi: Doi,
  title: SanitisedHtmlFragment,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  server: ArticleServer,
  authors: ArticleAuthors,
}>;

type Ports = {
  fetchArticle: GetArticleDetails,
  fetchReview: FetchReview,
  findVersionsForArticleDoi: FindVersionsForArticleDoi,
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

export const articleActivityPage: ActivityPage = (ports) => (params) => pipe(
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
        T.map(refereedPreprintBadge(doi)),
        TE.rightTask,
      ),
    },
    sequenceS(TE.ApplyPar),
    TE.chainW(({ articleDetails, badge, hasUserSavedArticle }) => pipe(
      getArticleFeedEventsByDateDescending(ports)(doi, articleDetails.server, userId),
      TE.rightTask,
      TE.map((feedItemsByDateDescending) => ({
        doi,
        articleDetails,
        feedItemsByDateDescending,
        header: renderHeader({
          articleDetails,
          badge,
          saveArticle: renderSaveArticle(doi, userId, hasUserSavedArticle),
          tweetThis,
        }),
        mainContent: renderFeed(feedItemsByDateDescending),
        authorsAndAbstract: renderAuthorsAndAbstract(articleDetails),
      })),
    )),
  ),
  TE.bimap(
    toErrorPage,
    (components) => ({
      content: pipe(
        components.mainContent,
        renderPage(components.header, components.authorsAndAbstract),
      ),
      title: striptags(components.articleDetails.title),
      description: pipe(
        articleMetaTagContent(components.feedItemsByDateDescending),
        renderDescriptionMetaTagContent,
      ),
      openGraph: {
        title: striptags(components.articleDetails.title),
        description: striptags(components.articleDetails.abstract),
      },
    }),
  ),
);
