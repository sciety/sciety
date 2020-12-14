import * as T from 'fp-ts/lib/Task';
import { Maybe } from 'true-myth';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type RenderFollowToggle = (
  userId: Maybe<UserId>,
  editorialCommunityId: EditorialCommunityId
) => Promise<HtmlFragment>;

export type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => T.Task<boolean>;

export default (
  follows: Follows,
): RenderFollowToggle => (
  async (userId, editorialCommunityId) => {
    const userFollows = await userId
      .map(async (value) => follows(value, editorialCommunityId)())
      .unwrapOrElse(async () => false);

    if (userFollows) {
      return toHtmlFragment(`
        <form method="post" action="/unfollow">
          <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}">
          <button type="submit" class="button button--small">Unfollow</button>
        </form>
      `);
    }

    return toHtmlFragment(`
      <form method="post" action="/follow">
        <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}">
        <button type="submit" class="button button--primary button--small">Follow</button>
      </form>
    `);
  }
);
