import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { constant, flow, pipe } from 'fp-ts/function';
import striptags from 'striptags';
import { projectHasUserSavedArticle } from './project-has-user-saved-article';
import { renderMetaPage } from './render-meta-page';
import { renderSaveArticle } from './render-save-article';
import { renderTweetThis } from './render-tweet-this';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { User } from '../types/user';

type MetaPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

type Params = {
  doi: Doi,
  user: O.Option<User>,
};

type GetArticleDetails = (doi: Doi) => TE.TaskEither<'not-found' | 'unavailable', {
  title: SanitisedHtmlFragment,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  authors: ReadonlyArray<string>,
  server: ArticleServer,
}>;

type Ports = {
  fetchArticle: GetArticleDetails,
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
};

const toErrorPage = (error: 'not-found' | 'unavailable') => {
  switch (error) {
    case 'not-found':
      return {
        type: error,
        message: toHtmlFragment(`
          We’re having trouble finding this information.
          Ensure you have the correct URL, or try refreshing the page.
          You may need to come back later.
        `),
      };
    case 'unavailable':
      return {
        type: error,
        message: toHtmlFragment(`
          We’re having trouble finding this information.
          Ensure you have the correct URL, or try refreshing the page.
          You may need to come back later.
        `),
      };
  }
};

export const articleMetaPage = (ports: Ports): MetaPage => flow(
  TE.right,
  TE.bind('userId', ({ user }) => pipe(user, O.map((u) => u.id), TE.right)),
  TE.bind('articleDetails', ({ doi }) => pipe(doi, ports.fetchArticle)),
  TE.bindW('hasUserSavedArticle', ({ doi, userId }) => pipe(
    userId,
    O.fold(constant(T.of(false)), (u) => projectHasUserSavedArticle(doi, u)(ports.getAllEvents)),
    TE.rightTask,
  )),
  TE.bindW('saveArticle', ({ doi, userId, hasUserSavedArticle }) => pipe(
    renderSaveArticle(doi, userId, hasUserSavedArticle),
    TE.right,
  )),
  TE.bindW('tweetThis', ({ doi }) => pipe(
    doi,
    renderTweetThis,
    TE.right,
  )),
  TE.bimap(
    toErrorPage,
    (components) => ({
      content: renderMetaPage(components),
      title: striptags(components.articleDetails.title),
      openGraph: {
        title: striptags(components.articleDetails.title),
        description: striptags(components.articleDetails.abstract),
      },
    }),
  ),
);
