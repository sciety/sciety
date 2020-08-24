import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type RenderFollowToggle = (
  userId: UserId,
  editorialCommunityId: EditorialCommunityId
) => Promise<string>;

type Follows = (editorialCommunityId: EditorialCommunityId) => boolean;
export type GetFollows = (userId: UserId) => Promise<Follows>;

export default (getFollows: GetFollows): RenderFollowToggle => (
  async (userId, editorialCommunityId) => {
    const follows = await getFollows(userId);

    if (follows(editorialCommunityId)) {
      return `
        <form method="post" action="/unfollow">
          <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}" />
          <button type="submit" class="ui mini button">Unfollow</button>
        </form>
      `;
    }

    return `
      <form method="post" action="/follow">
        <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}" />
        <button type="submit" class="ui mini primary button">Follow</button>
      </form>
    `;
  }
);
