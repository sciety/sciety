import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { GroupId } from '../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { UserId } from '../types/user-id';

export type Group = {
  avatarPath: string,
  id: GroupId,
  name: string,
};

type Follows = (u: UserId, g: GroupId) => T.Task<boolean>;

type RenderFollowToggle = (g: GroupId, groupName: string) => (isFollowing: boolean) => HtmlFragment;

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
  follows: Follows,
): RenderGroup => (userId) => (group) => pipe(
  userId,
  O.fold(
    () => T.of(false),
    (value: UserId) => follows(value, group.id),
  ),
  T.map(renderFollowToggle(group.id, group.name)),
  T.map(flow(
    render(group),
    toHtmlFragment,
  )),
);
