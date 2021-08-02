import * as O from 'fp-ts/Option';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import striptags from 'striptags';
import { renderMetaPage } from './render-meta-page';
import { DomainEvent } from '../../domain-events';
import { ArticleServer } from '../../types/article-server';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { toHtmlFragment } from '../../types/html-fragment';
import { Page } from '../../types/page';
import { RenderPageError } from '../../types/render-page-error';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';
import { User } from '../../types/user';
import { projectHasUserSavedArticle } from '../project-has-user-saved-article';
import { renderSaveArticle } from '../render-save-article';
import { renderTweetThis } from '../render-tweet-this';

type MetaPage = (params: Params) => RTE.ReaderTaskEither<Ports, RenderPageError, Page>;

type Params = {
  doi: Doi,
  user: O.Option<User>,
};

type GetArticleDetails = (doi: Doi) => TE.TaskEither<DE.DataError, {
  title: SanitisedHtmlFragment,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  authors: ReadonlyArray<string>,
  server: ArticleServer,
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

export const articleMetaPage: MetaPage = flow(
  RTE.right,
  RTE.bind('userId', ({ user }) => pipe(user, O.map((u) => u.id), RTE.right)),
  RTE.bind('articleDetails', ({ doi }) => (ports: Ports) => pipe(doi, ports.fetchArticle)),
  RTE.bindW('hasUserSavedArticle', ({ doi, userId }) => (ports: Ports) => pipe(
    userId,
    O.fold(constant(T.of(false)), (u) => projectHasUserSavedArticle(doi, u)(ports.getAllEvents)),
    TE.rightTask,
  )),
  RTE.bindW('saveArticle', ({ doi, userId, hasUserSavedArticle }) => pipe(
    renderSaveArticle(doi, userId, hasUserSavedArticle),
    RTE.right,
  )),
  RTE.bindW('tweetThis', ({ doi }) => pipe(
    doi,
    renderTweetThis,
    RTE.right,
  )),
  RTE.bimap(
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
