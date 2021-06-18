import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { pipe } from 'fp-ts/function';
import { Group } from './group';
import { Follows, isFollowedBy } from './is-followed-by';
import { GetAllEvents, projectFollowedGroupIds } from './project-followed-group-ids';
import { renderFollowList } from './render-follow-list';
import { renderFollowedGroup } from './render-followed-group';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

type GetGroup = (groupId: GroupId) => TO.TaskOption<Group>;

export type Ports = {
  follows: Follows,
  getAllEvents: GetAllEvents,
  getGroup: GetGroup,
};

type FollowList = (ports: Ports) => (userId: UserId, viewingUserId: O.Option<UserId>)
=> TE.TaskEither<never, HtmlFragment>;

export const followList: FollowList = (ports) => (userId, viewingUserId) => pipe(
  userId,
  projectFollowedGroupIds(ports.getAllEvents),
  T.chain(T.traverseArray(ports.getGroup)),
  T.map(RA.compact),
  T.chain(T.traverseArray(isFollowedBy(ports.follows)(viewingUserId))),
  T.map(RA.map(renderFollowedGroup)),
  T.map(renderFollowList),
  TE.rightTask,
);
