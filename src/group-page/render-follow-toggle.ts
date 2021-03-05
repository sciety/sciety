import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type RenderFollowToggle = (
  userId: O.Option<UserId>,
  groupId: GroupId
) => T.Task<HtmlFragment>;

export type Follows = (userId: UserId, groupId: GroupId) => T.Task<boolean>;

const renderFollowButton = (groupId: GroupId) => `
  <form method="post" action="/follow" class="follow-toggle">
    <input type="hidden" name="editorialcommunityid" value="${groupId.value}">
    <button type="submit" class="button button--primary button--small">Follow</button>
  </form>
`;

const renderUnfollowButton = (groupId: GroupId) => `
  <form method="post" action="/unfollow" class="follow-toggle">
    <input type="hidden" name="editorialcommunityid" value="${groupId.value}">
    <button type="submit" class="button button--small">Unfollow</button>
  </form>
`;

export const renderFollowToggle = (follows: Follows): RenderFollowToggle => (
  (userId, groupId) => (
    pipe(
      userId,
      O.fold(
        () => T.of(false),
        (value: UserId) => follows(value, groupId),
      ),
      T.map(
        B.fold(
          () => renderFollowButton(groupId),
          () => renderUnfollowButton(groupId),
        ),
      ),
      T.map(toHtmlFragment),
    )
  )
);
