import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderFollowers = (editorialCommunityId: EditorialCommunityId) => Promise<HtmlFragment>;

type GetFollowers<T> = (editorialCommunityId: EditorialCommunityId) => Promise<ReadonlyArray<T>>;

export default <T>(
  getFollowers: GetFollowers<T>,
): RenderFollowers => (
  async (editorialCommunityId) => {
    const followerCount = (await getFollowers(editorialCommunityId)).length;
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
