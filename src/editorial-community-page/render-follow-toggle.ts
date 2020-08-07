import EditorialCommunityId from '../types/editorial-community-id';

type RenderFollowToggle = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export type IsFollowed = (editorialCommunityId: EditorialCommunityId) => Promise<boolean>;

export default (
  isFollowed: IsFollowed,
): RenderFollowToggle => (
  async (editorialCommunityId) => {
    if (await isFollowed(editorialCommunityId)) {
      return `
        <form method="post" action="/unfollow">
          <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}">
          <button type="submit" class="ui mini button">Unfollow</button>
        </form>
      `;
    }
    return `
      <form method="post" action="/follow">
        <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}">
        <button type="submit" class="ui mini button">Follow</button>
      </form>
    `;
  }
);
