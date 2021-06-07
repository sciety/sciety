import { htmlEscape } from 'escape-goat';
import { pipe } from 'fp-ts/function';
import { Group } from './group';
import { renderFollowToggle } from '../../follow/render-follow-toggle';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';

export type GroupViewModel = Group & {
  isFollowedBy: boolean,
};

const render = (group: GroupViewModel) => (toggle: HtmlFragment) => `
  <img class="followed-groups__item_avatar" src="${group.avatarPath}" alt="">
  <a class="followed-groups__item_link" href="/groups/${group.id}">${htmlEscape(group.name)}</a>
  ${toggle}
`;

export const renderFollowedGroup = (group: GroupViewModel): HtmlFragment => pipe(
  group.isFollowedBy,
  renderFollowToggle(group.id, group.name),
  render(group),
  toHtmlFragment,
);
