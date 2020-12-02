import { Maybe } from 'true-myth';
import { FollowerDetails, renderFollower, renderFollowerError } from './render-follower';
import templateListItems from '../shared-components/list-items';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderFollowers = (editorialCommunityId: EditorialCommunityId) => Promise<HtmlFragment>;

export { FollowerDetails };
export type GetFollowers = (editorialCommunityId: EditorialCommunityId) => Promise<Array<Maybe<FollowerDetails>>>;

export default (
  getFollowers: GetFollowers,
): RenderFollowers => (
  async (editorialCommunityId) => {
    let contents = toHtmlFragment('<p>No followers yet.</p>');
    const followers = await getFollowers(editorialCommunityId);
    if (followers.length > 0) {
      const renderedFollowers = await Promise.all(followers.map(async (follower) => (
        follower.mapOrElse(renderFollowerError, renderFollower)
      )));
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
