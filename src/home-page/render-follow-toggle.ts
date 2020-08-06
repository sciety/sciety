import EditorialCommunityId from '../types/editorial-community-id';

export type RenderFollowToggle = (editorialCommunityId: EditorialCommunityId) => Promise<string>;

export type IsFollowed = (editorialCommunityId: EditorialCommunityId) => Promise<boolean>;

export default (
  isFollowed: IsFollowed,
): RenderFollowToggle => (
  async (editorialCommunityId) => {
    if (await isFollowed(editorialCommunityId)) {
      return `
        <form method="post" action="/unfollow">
          <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}" />
          <button type="submit">Unfollow</button>
        </form>
      `;
    }

    return `
      <form method="post" action="/follow">
        <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}" />
        <button type="submit">Follow</button>
      </form>
    `;
  }
);
