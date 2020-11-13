import { URL } from 'url';
import { Maybe, Result } from 'true-myth';
import { RenderFollowedEditorialCommunity } from './render-followed-editorial-community';
import templateListItems from '../shared-components/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderFollowList = (userId: UserId, viewingUserId: Maybe<UserId>) => Promise<Result<HtmlFragment, never>>;

export type GetFollowedEditorialCommunities = (userId: UserId) => Promise<ReadonlyArray<{
  id: EditorialCommunityId,
  name: string,
  avatar: URL,
}>>;

export default (
  getFollowedEditorialCommunities: GetFollowedEditorialCommunities,
  renderFollowedEditorialCommunity: RenderFollowedEditorialCommunity,
): RenderFollowList => (
  async (userId, viewingUserId) => {
    const list = await Promise.all((await getFollowedEditorialCommunities(userId))
      .map(async (editorialCommunity) => renderFollowedEditorialCommunity(editorialCommunity, viewingUserId)));

    let renderedFollowList: HtmlFragment;
    if (list.length > 0) {
      renderedFollowList = toHtmlFragment(`
        <ol class="ui large feed" role="list">
          ${templateListItems(list, 'event')}
        </ol>
      `);
    } else {
      renderedFollowList = toHtmlFragment(`
        <div class="ui info message">
          <div class="header">
            They’re not following anything
          </div>
          <p>When they do, they’ll be listed here.</p>
        </div>
      `);
    }
    return Result.ok(toHtmlFragment(`
      <section>
        <h2>
          Following
        </h2>
        ${renderedFollowList}
      </section>
    `));
  }
);
