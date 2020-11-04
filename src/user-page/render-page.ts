import { Maybe, Result } from 'true-myth';
import { UserId } from '../types/user-id';

type RenderPageError = {
  type: 'not-found' | 'unavailable',
  content: string
};

export type RenderPage = (userId: UserId, viewingUserId: Maybe<UserId>) => Promise<Result<string, RenderPageError>>;

type Component = (userId: UserId, viewingUserId: Maybe<UserId>) => Promise<Result<string, 'not-found' | 'unavailable'>>;

const template = (header: string) => (followList: string) => `
  <div class="hive-grid hive-grid--user">
    ${header}    
    <div class="user-page-contents">
      ${followList}
    </div>    
  </div>
`;

export default (
  renderHeader: Component,
  renderFollowList: Component,
): RenderPage => async (userId, viewingUserId) => {
  const header = renderHeader(userId, viewingUserId);
  const followList = renderFollowList(userId, viewingUserId);

  return Result.ok(template)
    .ap(await header)
    .ap(await followList)
    .mapErr((e) => {
      if (e === 'not-found') {
        return {
          type: 'not-found',
          content: 'User not found',
        };
      }
      return {
        type: 'unavailable',
        content: 'User information unavailable',
      };
    });
};
