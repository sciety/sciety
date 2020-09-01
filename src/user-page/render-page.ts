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

type UserDetails = {
  avatarUrl: string;
};

export type GetUserDetails = (userId: UserId) => Promise<UserDetails>;

export default (
  getFollowedEditorialCommunities: GetFollowedEditorialCommunities,
  renderFollowedEditorialCommunity: RenderFollowedEditorialCommunity,
  getUserDetails: GetUserDetails,
): RenderPage => {
  const renderFollowList = async (userId: UserId, viewingUserId: Maybe<UserId>): Promise<string> => {
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
      <section>
        <h2 class="ui header">
          Following
        </h2>
        ${renderedFollowList}
      </section>
    `;
  };

  const renderHeader = async (userId: UserId): Promise<string> => {
    const userDetails = await getUserDetails(userId);

    return `
      <header class="ui basic padded vertical segment">
        <h1 class="ui header">
          <img class="ui avatar image" src="${userDetails.avatarUrl}" alt="">@${userId}
        </h1>
      </header>
    `;
  };

  return async (userId, viewingUserId) => `
    <div class="ui aligned stackable grid">
      <div class="row">
        <div class="column">
          ${await renderHeader(userId)}
        </div>
      </div>
      <div class="row">
        <div class="ten wide column">
          ${await renderFollowList(userId, viewingUserId)}
        </div>
      </div>
    </div>
  `;
};
