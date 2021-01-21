import { URL } from 'url';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { RenderFollowToggle } from './render-follow-toggle';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type Community = {
  avatar: URL;
  id: EditorialCommunityId;
  name: string;
};

export type RenderEditorialCommunity = (userId: O.Option<UserId>) => (community: Community) => T.Task<HtmlFragment>;

const render = (community: Community) => (toggle: HtmlFragment): string => `
  <div class="editorial-community">
    <a href="/editorial-communities/${community.id.value}" class="editorial-community__link">
      <img src="${community.avatar.toString()}" alt="" class="editorial-community__avatar">
      <div class="editorial-community__name">
        ${community.name}
      </div>
    </a>
    <div class="editorial-community__toggle_wrapper">
      ${toggle}
    </div>
  </div>
`;

export const createRenderEditorialCommunity = (
  renderFollowToggle: RenderFollowToggle,
): RenderEditorialCommunity => (userId) => (community) => pipe(
  renderFollowToggle(userId, community.id, community.name),
  T.map(render(community)),
  T.map(toHtmlFragment),
);
