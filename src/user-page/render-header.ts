import { Result } from 'true-myth';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type UserDetails = {
  avatarUrl: string;
  displayName: string;
  handle: string;
};

export type GetUserDetails = (userId: UserId) => Promise<Result<UserDetails, 'not-found' | 'unavailable'>>;

type RenderHeader = (userId: UserId) => Promise<Result<HtmlFragment, 'not-found' | 'unavailable'>>;

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

export default (getUserDetails: GetUserDetails): RenderHeader => (
  async (userId) => {
    const userDetails = getUserDetails(userId);
    return Result.ok<typeof headerTemplate, 'not-found' | 'unavailable'>(headerTemplate)
      .ap(await userDetails);
  }
);
