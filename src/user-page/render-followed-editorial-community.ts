import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

type Community = {
  id: GroupId,
  name: string,
  avatarPath: string,
};

type RenderFollowedEditorialCommunity = (userId: O.Option<UserId>) => (
  community: Community,
) => T.Task<HtmlFragment>;

type RenderFollowToggle = (editorialcommunityid: GroupId) => (isFollowing: boolean) => HtmlFragment;

const render = (community: Community) => (toggle: HtmlFragment) => `
  <img class="followed-groups__item_avatar" src="${community.avatarPath}" alt="">
  <a class="followed-groups__item_link" href="/groups/${community.id.value}">${community.name}</a>
  ${toggle}
`;

export type Follows = (userId: UserId, editorialCommunityId: GroupId) => T.Task<boolean>;

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
