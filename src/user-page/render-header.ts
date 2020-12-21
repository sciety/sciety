import { Result } from 'true-myth';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type UserDetails = {
  avatarUrl: string;
  displayName: string;
  handle: string;
};

type GetUserDetails<E> = (userId: UserId) => Promise<Result<UserDetails, E>>;

type RenderHeader<E> = (userId: UserId) => Promise<Result<HtmlFragment, E>>;

const headerTemplate = (ud: UserDetails): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--user">
    <img src="${ud.avatarUrl}" alt="" class="page-header__avatar">
    <h1>
      ${ud.displayName}
      <div class="page-header__handle">
        @${ud.handle}
      </div>
    </h1>
  </header>
`);

export default <E>(getUserDetails: GetUserDetails<E>): RenderHeader<E> => (
  async (userId) => {
    const userDetails = getUserDetails(userId);
    return Result.ok<typeof headerTemplate, E>(headerTemplate)
      .ap(await userDetails);
  }
);
