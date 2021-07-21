import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

type Params = {
  handle: string,
};

type UserListPage = (params: Params) => TE.TaskEither<RenderPageError, Page>;

export const userListPage: UserListPage = () => pipe(
  {
    title: 'Saved articles',
    content: toHtmlFragment(''),
  },
  TE.right,
);
