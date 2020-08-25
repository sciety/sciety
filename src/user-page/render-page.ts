import { Maybe } from 'true-myth';
import { RenderFollowedEditorialCommunity } from './render-followed-editorial-community';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type RenderPage = (userId: UserId, viewingUserId: Maybe<UserId>) => Promise<string>;

export type GetFollowedEditorialCommunities = (userId: UserId) => Promise<ReadonlyArray<{
  id: EditorialCommunityId,
  name: string,
  avatarUrl: string,
}>>;

export default (
  getFollowedEditorialCommunities: GetFollowedEditorialCommunities,
  renderFollowedEditorialCommunity: RenderFollowedEditorialCommunity,
): RenderPage => (
  async (userId, viewingUserId) => {
    const list = await Promise.all((await getFollowedEditorialCommunities(userId))
      .map(async (editorialCommunity) => renderFollowedEditorialCommunity(editorialCommunity, viewingUserId)));

    let renderedFollowList: string;
    if (list.length > 0) {
      renderedFollowList = `
        <ol class="ui large feed">
          ${templateListItems(list, 'event')}
        </ol>
      `;
    } else {
      renderedFollowList = `
        <div class="ui info message">
          <div class="header">
            @${userId} isn’t following anything
          </div>
          <p>When they do, they’ll be listed here.</p>
        </div>
      `;
    }

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
              ${renderedFollowList}
            </section>
          </div>
        </div>
      </div>
    `;
  }
);
