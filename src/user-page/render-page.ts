import { Maybe, Result } from 'true-myth';
import { RenderFollowedEditorialCommunity } from './render-followed-editorial-community';
import createRenderHeader, { GetUserDetails } from './render-header';
import templateListItems from '../templates/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type RenderPageError = {
  type: 'not-found' | 'unavailable',
  content: string
};

type RenderPage = (userId: UserId, viewingUserId: Maybe<UserId>) => Promise<Result<string, RenderPageError>>;

export type GetFollowedEditorialCommunities = (userId: UserId) => Promise<ReadonlyArray<{
  id: EditorialCommunityId,
  name: string,
  avatarUrl: string,
}>>;

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
  getUserDetails: GetUserDetails,
): RenderPage => {
  const renderFollowList: Component = async (userId, viewingUserId) => {
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
            They’re not following anything
          </div>
          <p>When they do, they’ll be listed here.</p>
        </div>
      `;
    }
    return Result.ok(`
      <section>
        <h2 class="ui header">
          Following
        </h2>
        ${renderedFollowList}
      </section>
    `);
  };

  const renderHeader: Component = createRenderHeader(getUserDetails);

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
