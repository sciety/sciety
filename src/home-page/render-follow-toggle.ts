import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { flow, pipe } from 'fp-ts/function';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type RenderFollowToggle = (
  userId: O.Option<UserId>,
  groupId: GroupId,
  editorialCommunityName: string,
) => T.Task<HtmlFragment>;

type Follows = (u: UserId, g: GroupId) => T.Task<boolean>;

const renderFollowButton = (groupId: GroupId, editorialCommunityName: string) => `
  <form method="post" action="/follow">
    <input type="hidden" name="groupId" value="${groupId.value}" />
    <button type="submit" class="button button--primary button--small" aria-label="Follow ${editorialCommunityName}">
      Follow
    </button>
  </form>
`;

const renderUnfollowButton = (groupId: GroupId, editorialCommunityName: string) => `
  <form method="post" action="/unfollow">
    <input type="hidden" name="groupId" value="${groupId.value}" />
    <button type="submit" class="button button--small" aria-label="Unfollow ${editorialCommunityName}">
      Unfollow
    </button>
  </form>
`;

export const renderFollowToggle = (follows: Follows): RenderFollowToggle => (
  (userId, groupId, editorialCommunityName) => (
    pipe(
      userId,
      O.fold(
        () => T.of(false),
        (value: UserId) => follows(value, groupId),
      ),
      T.map(flow(
        B.fold(
          () => renderFollowButton(groupId, editorialCommunityName),
          () => renderUnfollowButton(groupId, editorialCommunityName),
        ),
        toHtmlFragment,
      )),
    )
  )
);
