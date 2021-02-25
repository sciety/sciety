import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type RenderFollowToggle = (
  userId: O.Option<UserId>,
  editorialCommunityId: EditorialCommunityId
) => T.Task<HtmlFragment>;

export type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => T.Task<boolean>;

const renderFollowButton = (editorialCommunityId: EditorialCommunityId) => `
  <form method="post" action="/follow" class="follow-toggle">
    <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}">
    <button type="submit" class="button button--primary button--small">Follow</button>
  </form>
`;

const renderUnfollowButton = (editorialCommunityId: EditorialCommunityId) => `
  <form method="post" action="/unfollow" class="follow-toggle">
    <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}">
    <button type="submit" class="button button--small">Unfollow</button>
  </form>
`;

export const renderFollowToggle = (follows: Follows): RenderFollowToggle => (
  (userId, editorialCommunityId) => (
    pipe(
      userId,
      O.fold(
        () => T.of(false),
        (value: UserId) => follows(value, editorialCommunityId),
      ),
      T.map(
        B.fold(
          () => renderFollowButton(editorialCommunityId),
          () => renderUnfollowButton(editorialCommunityId),
        ),
      ),
      T.map(toHtmlFragment),
    )
  )
);
