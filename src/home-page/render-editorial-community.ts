import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { RenderFollowToggle } from './render-follow-toggle';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type Community = {
  avatarPath: string,
  id: GroupId,
  name: string,
};

export type RenderEditorialCommunity = (userId: O.Option<UserId>) => (community: Community) => T.Task<HtmlFragment>;

const render = (community: Community) => (toggle: HtmlFragment) => `
  <div class="group">
    <a href="/groups/${community.id.value}" class="group__link">
      <img src="${community.avatarPath}" alt="" class="group__avatar">
      <div class="group__name">
        ${community.name}
      </div>
    </a>
    <div class="group__toggle_wrapper">
      ${toggle}
    </div>
  </div>
`;

export const renderEditorialCommunity = (
  renderFollowToggle: RenderFollowToggle,
): RenderEditorialCommunity => (userId) => (community) => pipe(
  renderFollowToggle(userId, community.id, community.name),
  T.map(flow(
    render(community),
    toHtmlFragment,
  )),
);
