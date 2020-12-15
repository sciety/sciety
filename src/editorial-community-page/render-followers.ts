import * as T from 'fp-ts/lib/Task';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderFollowers = (editorialCommunityId: EditorialCommunityId) => Promise<HtmlFragment>;

type GetFollowers<U> = (editorialCommunityId: EditorialCommunityId) => T.Task<ReadonlyArray<U>>;

export default <U>(
  getFollowers: GetFollowers<U>,
): RenderFollowers => (
  async (editorialCommunityId) => {
    const followerCount = (await getFollowers(editorialCommunityId)()).length;
    const usersFragment = followerCount === 1 ? 'user is' : 'users are';
    return toHtmlFragment(`
      <section class="followers">
        <h2>
          Followers
        </h2>
        <p>
          ${followerCount} ${usersFragment} following this community.
        </p>
      </section>
    `);
  });
