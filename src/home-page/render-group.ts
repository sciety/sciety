import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { RenderFollowToggle } from './render-follow-toggle';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type Group = {
  avatarPath: string,
  id: GroupId,
  name: string,
};

export type RenderGroup = (userId: O.Option<UserId>) => (group: Group) => T.Task<HtmlFragment>;

const render = (group: Group) => (toggle: HtmlFragment) => `
  <div class="group">
    <a href="/groups/${group.id.value}" class="group__link">
      <img src="${group.avatarPath}" alt="" class="group__avatar">
      <div class="group__name">
        ${group.name}
      </div>
    </a>
    <div class="group__toggle_wrapper">
      ${toggle}
    </div>
  </div>
`;

export const renderGroup = (
  renderFollowToggle: RenderFollowToggle,
): RenderGroup => (userId) => (group) => pipe(
  renderFollowToggle(userId, group.id, group.name),
  T.map(flow(
    render(group),
    toHtmlFragment,
  )),
);
