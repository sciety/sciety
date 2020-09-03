import { Maybe, Result } from 'true-myth';
import createRenderFollowList, { GetFollowedEditorialCommunities } from './render-follow-list';
import { RenderFollowedEditorialCommunity } from './render-followed-editorial-community';
import { UserId } from '../types/user-id';

export type RenderPageError = {
  type: 'not-found' | 'unavailable',
  content: string
};

type RenderPage = (userId: UserId, viewingUserId: Maybe<UserId>) => Promise<Result<string, RenderPageError>>;

type Component = (userId: UserId, viewingUserId: Maybe<UserId>) => Promise<Result<string, 'not-found' | 'unavailable'>>;

const template = (header: string) => (followList: string) => `
  <div class="ui aligned stackable grid">
    <div class="row">
      <div class="column">
        ${header}
      </div>
    </div>
    <div class="row">
      <div class="ten wide column">
        ${followList}
      </div>
    </div>
  </div>
`;

export default (
  getFollowedEditorialCommunities: GetFollowedEditorialCommunities,
  renderFollowedEditorialCommunity: RenderFollowedEditorialCommunity,
  renderHeader: Component,
): RenderPage => {
  const renderFollowList: Component = createRenderFollowList(
    getFollowedEditorialCommunities,
    renderFollowedEditorialCommunity,
  );

  return async (userId, viewingUserId) => {
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
};
