import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { Ports, savedArticles } from '../user-page/saved-articles/saved-articles';

type Params = {
  handle: string,
};

type UserListPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const userListPage = (ports: Ports): UserListPage => () => pipe(
  savedArticles(ports)([]),
  T.map((content) => ({
    title: 'Saved articles',
    content,
  })),
  TE.rightTask,
);
