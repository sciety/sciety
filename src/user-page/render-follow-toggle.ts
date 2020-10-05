import { Maybe } from 'true-myth';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

type RenderFollowToggle = (
  userId: Maybe<UserId>,
  editorialCommunityId: EditorialCommunityId
) => Promise<string>;

export type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => Promise<boolean>;

export default (
  follows: Follows,
): RenderFollowToggle => (
  async (userId, editorialCommunityId) => {
    const userFollows = await userId
      .map(async (value) => follows(value, editorialCommunityId))
      .unwrapOrElse(async () => false);

    if (userFollows) {
      return `
        <form method="post" action="/unfollow">
          <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}">
          <button type="submit" class="button button--small">Unfollow</button>
        </form>
      `;
    }

    return `
      <form method="post" action="/follow">
        <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}">
        <button type="submit" class="button button--primary button--small">Follow</button>
      </form>
    `;
  }
);
