import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { GroupId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type RenderFollowToggle = (
  userId: O.Option<UserId>,
  editorialCommunityId: GroupId,
  editorialCommunityName: string,
) => T.Task<HtmlFragment>;

type Follows = (userId: UserId, editorialCommunityId: GroupId) => T.Task<boolean>;

const renderFollowButton = (editorialCommunityId: GroupId, editorialCommunityName: string) => `
  <form method="post" action="/follow">
    <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}" />
    <button type="submit" class="button button--primary button--small" aria-label="Follow ${editorialCommunityName}">
      Follow
    </button>
  </form>
`;

const renderUnfollowButton = (editorialCommunityId: GroupId, editorialCommunityName: string) => `
  <form method="post" action="/unfollow">
    <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}" />
    <button type="submit" class="button button--small" aria-label="Unfollow ${editorialCommunityName}">
      Unfollow
    </button>
  </form>
`;

export const renderFollowToggle = (follows: Follows): RenderFollowToggle => (
  (userId, editorialCommunityId, editorialCommunityName) => (
    pipe(
      userId,
      O.fold(
        () => T.of(false),
        (value: UserId) => follows(value, editorialCommunityId),
      ),
      T.map(
        B.fold(
          () => renderFollowButton(editorialCommunityId, editorialCommunityName),
          () => renderUnfollowButton(editorialCommunityId, editorialCommunityName),
        ),
      ),
      T.map(toHtmlFragment),
    )
  )
);
