import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Group } from './group';
import { renderFollowToggle } from '../../follow/render-follow-toggle';
import { GroupId } from '../../types/group-id';
import { HtmlFragment, toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

type GroupViewModel = Group & {
  isFollowedBy: boolean,
};

const render = (group: GroupViewModel) => (toggle: HtmlFragment) => `
  <img class="followed-groups__item_avatar" src="${group.avatarPath}" alt="">
  <a class="followed-groups__item_link" href="/groups/${group.id.value}">${htmlEscape(group.name)}</a>
  ${toggle}
`;

export type Follows = (u: UserId, g: GroupId) => T.Task<boolean>;

type IsFollowedBy = (follows: Follows)
=> (userId: O.Option<UserId>)
=> (group: Group)
=> T.Task<GroupViewModel>;

export const isFollowedBy: IsFollowedBy = (follows) => (userId) => (group) => pipe(
  userId,
  O.fold(
    () => T.of(false),
    (u: UserId) => follows(u, group.id),
  ),
  T.map((b) => ({
    ...group,
    isFollowedBy: b,
  })),
);

export const renderFollowedGroup = (group: GroupViewModel): HtmlFragment => pipe(
  group.isFollowedBy,
  renderFollowToggle(group.id, group.name),
  render(group),
  toHtmlFragment,
);
