import * as B from 'fp-ts/boolean';
import { flow } from 'fp-ts/function';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const renderFollowButton = (editorialCommunityId: EditorialCommunityId) => `
  <form method="post" action="/follow">
    <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}">
    <button type="submit" class="button button--primary button--small">Follow</button>
  </form>
`;

const renderUnfollowButton = (editorialCommunityId: EditorialCommunityId) => `
  <form method="post" action="/unfollow">
    <input type="hidden" name="editorialcommunityid" value="${editorialCommunityId.value}">
    <button type="submit" class="button button--small">Unfollow</button>
  </form>
`;

type RenderFollowToggle = (editorialCommunityId: EditorialCommunityId) => (isFollowing: boolean) => HtmlFragment;

const renderFollowToggle: RenderFollowToggle = (editorialCommunityId) => flow(
  B.fold(
    () => renderFollowButton(editorialCommunityId),
    () => renderUnfollowButton(editorialCommunityId),
  ),
  toHtmlFragment,
);

export { renderFollowToggle };
