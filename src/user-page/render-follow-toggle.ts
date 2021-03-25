import * as B from 'fp-ts/boolean';
import { flow } from 'fp-ts/function';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const renderFollowButton = (groupId: GroupId) => `
  <form method="post" action="/follow">
    <input type="hidden" name="editorialcommunityid" value="${groupId.value}">
    <button type="submit" class="button button--primary button--small">Follow</button>
  </form>
`;

const renderUnfollowButton = (groupId: GroupId) => `
  <form method="post" action="/unfollow">
    <input type="hidden" name="editorialcommunityid" value="${groupId.value}">
    <button type="submit" class="button button--small">Unfollow</button>
  </form>
`;

type RenderFollowToggle = (g: GroupId) => (isFollowing: boolean) => HtmlFragment;

const renderFollowToggle: RenderFollowToggle = (groupId) => flow(
  B.fold(
    () => renderFollowButton(groupId),
    () => renderUnfollowButton(groupId),
  ),
  toHtmlFragment,
);

export { renderFollowToggle };
