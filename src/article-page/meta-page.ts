import * as O from 'fp-ts/Option';
import * as RTE from 'fp-ts/ReaderTaskEither';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
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

type MetaPage = (params: Params) => RTE.ReaderTaskEither<Ports, RenderPageError, Page>;

type Params = {
  doi: Doi,
  user: O.Option<User>,
};

type GetArticleDetails = (doi: Doi) => TE.TaskEither<'not-found' | 'unavailable', {
  title: SanitisedHtmlFragment,
  abstract: SanitisedHtmlFragment, // TODO Use HtmlFragment as the HTML is stripped
  authors: Array<string>,
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

export const articleMetaPage: MetaPage = flow(
  RTE.right,
  RTE.bind('userId', ({ user }) => pipe(user, O.map((u) => u.id), RTE.right)),
  RTE.bind('articleDetails', ({ doi }) => (ports: Ports) => pipe(doi, ports.fetchArticle)),
  RTE.bindW('saveArticle', ({ doi, userId }) => (ports: Ports) => pipe(
    renderSaveArticle(doi, userId)((...args) => projectHasUserSavedArticle(...args)(ports.getAllEvents)),
    TE.rightTask,
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
      openGraph: {
        title: striptags(components.articleDetails.title),
        description: striptags(components.articleDetails.abstract),
      },
    }),
  ),
);
