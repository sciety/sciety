import * as TE from 'fp-ts/lib/TaskEither';
import { flow } from 'fp-ts/lib/function';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type UserDetails = {
  avatarUrl: string,
  displayName: string,
  handle: string,
};

type GetUserDetails<E> = (userId: UserId) => TE.TaskEither<E, UserDetails>;

type RenderHeader<E> = (userId: UserId) => TE.TaskEither<E, HtmlFragment>;

const headerTemplate = (ud: UserDetails): string => `
  <header class="page-header page-header--user">
    <img src="${ud.avatarUrl}" alt="" class="page-header__avatar">
    <h1>
      ${ud.displayName}
      <div class="page-header__handle">
        @${ud.handle}
      </div>
    </h1>
  </header>
`;

export const createRenderHeader = <E>(getUserDetails: GetUserDetails<E>): RenderHeader<E> => flow(
  getUserDetails,
  TE.map(headerTemplate),
  TE.map(toHtmlFragment),
);
