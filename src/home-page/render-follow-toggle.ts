import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as B from 'fp-ts/lib/boolean';
import { pipe } from 'fp-ts/lib/function';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type RenderFollowToggle = (
  userId: O.Option<UserId>,
  editorialCommunityId: EditorialCommunityId,
  editorialCommunityName: string,
) => T.Task<HtmlFragment>;

type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => T.Task<boolean>;

type RenderButton = (editorialCommunityId: EditorialCommunityId, editorialCommunityName: string) => string;

const renderFollowButton: RenderButton = (editorialCommunityId, editorialCommunityName) => `
  <form method="post" action="/follow">
    <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}" />
    <button type="submit" class="button button--primary button--small" aria-label="Follow ${editorialCommunityName}">
      Follow
    </button>
  </form>
`;

const renderUnfollowButton: RenderButton = (editorialCommunityId, editorialCommunityName) => `
  <form method="post" action="/unfollow">
    <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}" />
    <button type="submit" class="button button--small" aria-label="Unfollow ${editorialCommunityName}">
      Unfollow
    </button>
  </form>
`;

export default (follows: Follows): RenderFollowToggle => (
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
