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
      content,
    }),
  ),
);
