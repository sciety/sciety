import * as B from 'fp-ts/boolean';
import { flow } from 'fp-ts/function';
import { groupProperty } from './follow-handler';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

const renderFollowButton = (groupId: GroupId, groupName: string) => `
  <form method="post" action="/follow">
    <input type="hidden" name="${groupProperty}" value="${groupId.value}" />
    <button type="submit" class="follow-button" aria-label="Follow ${groupName}">
      Follow
    </button>
  </form>
`;

const renderUnfollowButton = (groupId: GroupId, groupName: string) => `
  <form method="post" action="/unfollow">
    <input type="hidden" name="editorialcommunityid" value="${groupId.value}" />
    <button type="submit" class="button button--small" aria-label="Unfollow ${groupName}">
      Unfollow
    </button>
  </form>
`;

type RenderFollowToggle = (groupId: GroupId, groupName: string) => (isFollowing: boolean) => HtmlFragment;

export const renderFollowToggle: RenderFollowToggle = (groupId, groupName) => flow(
  B.fold(
    () => renderFollowButton(groupId, groupName),
    () => renderUnfollowButton(groupId, groupName),
  ),
  toHtmlFragment,
);
