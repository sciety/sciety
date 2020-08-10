import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';

export type RenderFollowToggle = (
  followList: FollowList,
  editorialCommunityId: EditorialCommunityId
) => Promise<string>;

export default (): RenderFollowToggle => (
  async (followList, editorialCommunityId) => {
    if (followList.follows(editorialCommunityId)) {
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
        <button type="submit" class="ui mini primary button">Follow</button>
      </form>
    `;
  }
);
