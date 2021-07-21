import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as DE from '../types/data-error';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { UserId } from '../types/user-id';
import { GetAllEvents, projectSavedArticleDois } from '../user-page/saved-articles/project-saved-article-dois';
import { Ports as SavedArticlePorts, savedArticles } from '../user-page/saved-articles/saved-articles';

type Params = {
  handle: string,
};

type Ports = SavedArticlePorts & {
  getAllEvents: GetAllEvents,
  getUserId: (handle: string) => TE.TaskEither<DE.DataError, UserId>,
};

type UserListPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

const render = (savedArticlesList: HtmlFragment, handle: string) => pipe(
  `<div class="page-content__background">
      <div class="sciety-grid sciety-grid--one-column">
        <header class="page-header page-header--user-list">
          <h1>
            List: saved articles
          </h1>
          <p class="page-header__subheading">
            <img src="#" alt="" class="page-header__avatar">
            <span>A list by <a href="/users/${handle}">${handle}</a></span>
          </p>
          <p class="page-header__description">Articles that have been saved by ${handle}, most recently saved first.</p>
          <p class="page-header__meta"><span class="visually-hidden">This list contains </span>8 articles<span><span>Last updated Jul 9, 2021</span></p>
        </header>
        ${savedArticlesList}
      </div>
    </div>`,
  toHtmlFragment,
);

export const userListPage = (ports: Ports): UserListPage => ({ handle }) => pipe(
  handle,
  ports.getUserId,
  TE.chainTaskK(projectSavedArticleDois(ports.getAllEvents)),
  TE.chainTaskK(savedArticles(ports)),
  TE.bimap(
    (dataError) => ({
      type: dataError,
      message: toHtmlFragment('User not found.'),
    }),
    (content: HtmlFragment) => ({
      title: 'Saved articles',
      content: render(content, handle),
    }),
  ),
);
