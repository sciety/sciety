import { htmlEscape } from 'escape-goat';
import * as B from 'fp-ts/boolean';
import { flow } from 'fp-ts/function';
import { pathToSubmitFollow } from '../../../../../http/form-submission-handlers/submit-paths';
import { inputFieldNames } from '../../../../../standards/input-field-names';
import { GroupId } from '../../../../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../../../../types/html-fragment';

const renderFollowButton = (groupId: GroupId, groupName: string) => `
  <form method="post" action="${pathToSubmitFollow()}">
    <input type="hidden" name="${inputFieldNames.groupId}" value="${groupId}" />
    <button type="submit" class="follow-button" aria-label="Follow ${htmlEscape(groupName)}">
      Follow
    </button>
  </form>
`;

const renderUnfollowButton = (groupId: GroupId, groupName: string) => `
  <form method="post" action="/unfollow">
    <input type="hidden" name="${inputFieldNames.groupId}" value="${groupId}" />
    <button type="submit" class="unfollow-button" aria-label="Unfollow ${htmlEscape(groupName)}">
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
