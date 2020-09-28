import { Result } from 'true-myth';
import { UserId } from '../types/user-id';

type UserDetails = {
  avatarUrl: string;
  displayName: string;
  handle: string;
};

export type GetUserDetails = (userId: UserId) => Promise<Result<UserDetails, 'not-found' | 'unavailable'>>;

type RenderHeader = (userId: UserId) => Promise<Result<string, 'not-found' | 'unavailable'>>;

const headerTemplate = (ud: UserDetails): string => `
  <h1 class="user-page-header">
    <img src="${ud.avatarUrl}" alt="" class="user-page-header__avatar">
    <div>
      ${ud.displayName}
      <div class="user-page-header__handle">
        @${ud.handle}
      </div>
    </div>
  </h1>
`;

export default (getUserDetails: GetUserDetails): RenderHeader => (
  async (userId) => {
    const userDetails = getUserDetails(userId);
    return Result.ok<typeof headerTemplate, 'not-found' | 'unavailable'>(headerTemplate)
      .ap(await userDetails);
  }
);
