import { Maybe } from 'true-myth';
import templateListItems from '../shared-components/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type FollowerDetails = {
  avatarUrl: string,
  handle: string,
  displayName: string,
  userId: UserId,
};
type RenderFollowers = (editorialCommunityId: EditorialCommunityId) => Promise<HtmlFragment>;
type RenderFollower = (followerDetails: Maybe<FollowerDetails>) => Promise<HtmlFragment>;

export type GetFollowers = (editorialCommunityId: EditorialCommunityId) => Promise<Array<Maybe<FollowerDetails>>>;

export default (
  getFollowers: GetFollowers,
  renderFollower: RenderFollower,
): RenderFollowers => (
  async (editorialCommunityId) => {
    let contents = toHtmlFragment('<p>No followers yet.</p>');
    const followers = await getFollowers(editorialCommunityId);
    if (followers.length > 0) {
      const renderedFollowers = await Promise.all(followers.map(renderFollower));
      contents = toHtmlFragment(`
        <ul class="ui very relaxed list" role="list">
          ${templateListItems(renderedFollowers)}
        </ul>
      `);
    }

    return toHtmlFragment(`
      <section class="followers">
        <h2>
          Followers
        </h2>
        ${contents}
      </section>
    `);
  });
