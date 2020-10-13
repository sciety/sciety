import { Maybe } from 'true-myth';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type RenderFollowToggle = (
  userId: Maybe<UserId>,
  editorialCommunityId: EditorialCommunityId,
  editorialCommunityName: string,
) => Promise<string>;

type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => Promise<boolean>;

export default (follows: Follows): RenderFollowToggle => (
  async (userId, editorialCommunityId, editorialCommunityName) => {
    const userFollows = await userId
      .map(async (value) => follows(value, editorialCommunityId))
      .unwrapOrElse(async () => false);

    if (userFollows) {
      return `
        <form method="post" action="/unfollow">
          <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}" />
          <button type="submit" class="button button--small" aria-label="Unfollow ${editorialCommunityName}">
            Unfollow
          </button>
        </form>
      `;
    }

    return `
      <form method="post" action="/follow">
        <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}" />
        <button type="submit" class="button button--primary button--small" aria-label="Follow ${editorialCommunityName}">
          Follow
        </button>
      </form>
    `;
  }
);
