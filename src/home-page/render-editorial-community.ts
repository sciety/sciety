import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { RenderFollowToggle } from './render-follow-toggle';
import { GroupId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type Community = {
  avatarPath: string,
  id: GroupId,
  name: string,
};

export type RenderEditorialCommunity = (userId: O.Option<UserId>) => (community: Community) => T.Task<HtmlFragment>;

const render = (community: Community) => (toggle: HtmlFragment) => `
  <div class="editorial-community">
    <a href="/groups/${community.id.value}" class="editorial-community__link">
      <img src="${community.avatarPath}" alt="" class="editorial-community__avatar">
      <div class="editorial-community__name">
        ${community.name}
      </div>
    </a>
    <div class="editorial-community__toggle_wrapper">
      ${toggle}
    </div>
  </div>
`;

export const renderEditorialCommunity = (
  renderFollowToggle: RenderFollowToggle,
): RenderEditorialCommunity => (userId) => (community) => pipe(
  renderFollowToggle(userId, community.id, community.name),
  T.map(render(community)),
  T.map(toHtmlFragment),
);
