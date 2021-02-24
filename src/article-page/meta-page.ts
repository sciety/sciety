import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { projectHasUserSavedArticle } from './project-has-user-saved-article';
import { createRenderArticleAbstract } from './render-article-abstract';
import { renderMetaPage } from './render-meta-page';
import { renderSaveArticle } from './render-save-article';
import { renderTweetThis } from './render-tweet-this';
import { ArticleServer } from '../types/article-server';
import { Doi } from '../types/doi';
import { DomainEvent } from '../types/domain-events';
import { HtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { SanitisedHtmlFragment } from '../types/sanitised-html-fragment';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type MetaPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

type Page = {
  title: string,
  content: HtmlFragment,
  openGraph: {
    title: string,
    description: string,
  },
};

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

const getUserId = (user: O.Option<User>): O.Option<UserId> => pipe(
  user,
  O.map((u) => u.id),
);

export const articleMetaPage = (ports: Ports): MetaPage => {
  const renderAbstract = createRenderArticleAbstract(
    flow(
      ports.fetchArticle,
      TE.map((article) => article.abstract),
    ),
  );
  const renderPage = renderMetaPage(
    renderAbstract,
    ports.fetchArticle,
    renderSaveArticle(projectHasUserSavedArticle(ports.getAllEvents)),
    renderTweetThis,
  );
  return ({ doi, user }) => renderPage(doi, getUserId(user));
};
