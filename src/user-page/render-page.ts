import { RenderFollowedEditorialCommunity } from './render-followed-editorial-community';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';
import { UserId } from '../types/user-id';

type RenderPage = (userId: UserId, followList: FollowList) => Promise<string>;

export type GetFollowedEditorialCommunities = (userId: UserId) => Promise<ReadonlyArray<{
  id: EditorialCommunityId,
  name: string,
  avatarUrl: string,
}>>;

export default (
  getFollowedEditorialCommunities: GetFollowedEditorialCommunities,
  renderFollowedEditorialCommunity: RenderFollowedEditorialCommunity,
): RenderPage => (
  async (userId, followList) => {
    const list = await Promise.all((await getFollowedEditorialCommunities(userId))
      .map(async (editorialCommunity) => renderFollowedEditorialCommunity(editorialCommunity, followList)));
    return `
      <div class="ui aligned stackable grid">
        <div class="row">
          <div class="column">
            <header class="ui basic padded vertical segment">
              <h1>@${userId}</h1>
            </header>
          </div>
        </div>
        <div class="row">
          <div class="ten wide column">
            <section>
              <h2 class="ui header">
                Following
              </h2>
              <ol class="ui large feed">
                ${templateListItems(list, 'event')}
              </ol>
            </section>
          </div>
        </div>
      </div>
    `;
  }
);
