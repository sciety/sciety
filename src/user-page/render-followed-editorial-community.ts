import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type Community = {
  id: EditorialCommunityId,
  name: string,
  avatarPath: string,
};

type RenderFollowedEditorialCommunity = (userId: O.Option<UserId>) => (
  community: Community,
) => T.Task<HtmlFragment>;

type RenderFollowToggle = (editorialcommunityid: EditorialCommunityId) => (isFollowing: boolean) => HtmlFragment;

const render = (community: Community) => (toggle: HtmlFragment): string => `
  <img class="followed-communities__item_avatar" src="${community.avatarPath}" alt="">
  <a class="followed-communities__item_link" href="/groups/${community.id.value}">${community.name}</a>
  ${toggle}
`;

export type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => T.Task<boolean>;

export const renderFollowedEditorialCommunity = (
  renderFollowToggle: RenderFollowToggle,
  follows: Follows,
): RenderFollowedEditorialCommunity => (userId) => (community) => pipe(
  userId,
  O.fold(
    () => T.of(false),
    (u: UserId) => follows(u, community.id),
  ),
  T.map(flow(
    renderFollowToggle(community.id),
    render(community),
    toHtmlFragment,
  )),
);
