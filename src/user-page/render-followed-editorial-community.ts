import { URL } from 'url';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type Community = {
  id: EditorialCommunityId,
  name: string,
  avatar: URL,
};

export type RenderFollowedEditorialCommunity = (userId: O.Option<UserId>) => (
  community: Community,
) => T.Task<HtmlFragment>;

type RenderFollowToggle = (
  userId: O.Option<UserId>,
  editorialcommunityid: EditorialCommunityId,
) => T.Task<HtmlFragment>;

const render = (community: Community) => (toggle: HtmlFragment): string => `
  <img class="followed-communities__item_avatar" src="${community.avatar.toString()}" alt="">
  <a class="followed-communities__item_link" href="/editorial-communities/${community.id.value}">${community.name}</a>
  ${toggle}
`;

export const createRenderFollowedEditorialCommunity = (
  renderFollowToggle: RenderFollowToggle,
): RenderFollowedEditorialCommunity => (userId) => (community) => pipe(
  renderFollowToggle(userId, community.id),
  T.map(render(community)),
  T.map(toHtmlFragment),
);
