import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

type RenderFollowers = (editorialCommunityId: EditorialCommunityId) => Promise<HtmlFragment>;

type GetFollowers<T> = (editorialCommunityId: EditorialCommunityId) => Promise<ReadonlyArray<T>>;

export default <T>(
  getFollowers: GetFollowers<T>,
): RenderFollowers => (
  async (editorialCommunityId) => {
    const followers = await getFollowers(editorialCommunityId);
    return toHtmlFragment(`
      <section class="followers">
        <h2>
          Followers
        </h2>
        ${followers.length}
      </section>
    `);
  });
