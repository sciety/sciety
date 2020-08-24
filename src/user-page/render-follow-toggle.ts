import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';
import { UserId } from '../types/user-id';

type RenderFollowToggle = (
  userId: UserId,
  editorialCommunityId: EditorialCommunityId
) => Promise<string>;

export type GetFollowList = (userId: UserId) => Promise<FollowList>;

export default (
  getFollowList: GetFollowList,
): RenderFollowToggle => (
  async (userId, editorialCommunityId) => {
    const followList = await getFollowList(userId);
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
