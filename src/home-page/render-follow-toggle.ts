import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import EditorialCommunityId from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type RenderFollowToggle = (
  userId: O.Option<UserId>,
  editorialCommunityId: EditorialCommunityId,
  editorialCommunityName: string,
) => Promise<HtmlFragment>;

type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => T.Task<boolean>;

export default (follows: Follows): RenderFollowToggle => (
  async (userId, editorialCommunityId, editorialCommunityName) => {
    const userFollows = await O.fold(
      () => T.of(false),
      (value: UserId) => follows(value, editorialCommunityId),
    )(userId)();

    if (userFollows) {
      return toHtmlFragment(`
        <form method="post" action="/unfollow">
          <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}" />
          <button type="submit" class="button button--small" aria-label="Unfollow ${editorialCommunityName}">
            Unfollow
          </button>
        </form>
      `);
    }

    return toHtmlFragment(`
      <form method="post" action="/follow">
        <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}" />
        <button type="submit" class="button button--primary button--small" aria-label="Follow ${editorialCommunityName}">
          Follow
        </button>
      </form>
    `);
  }
);
