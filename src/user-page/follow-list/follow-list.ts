import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as TO from 'fp-ts/TaskOption';
import { flow, pipe } from 'fp-ts/function';
import { GetAllEvents, projectFollowedGroupIds } from './project-followed-group-ids';
import { renderFollowList } from './render-follow-list';
import { Follows, renderFollowedGroup } from './render-followed-group';
import { GroupId } from '../../types/group-id';
import { HtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';

type FetchGroup = (groupId: GroupId) => TO.TaskOption<{
  id: GroupId,
  name: string,
  avatarPath: string,
}>;

export type Ports = {
  follows: Follows,
  getAllEvents: GetAllEvents,
  getGroup: FetchGroup,
};

type FollowList = (ports: Ports) => (userId: UserId, viewingUserId: O.Option<UserId>)
=> TE.TaskEither<never, HtmlFragment>;

export const followList: FollowList = (ports) => (userId, viewingUserId) => pipe(
  userId,
  projectFollowedGroupIds(ports.getAllEvents),
  T.chain(T.traverseArray(ports.getGroup)),
  T.chain(flow(
    RA.compact,
    T.traverseArray(renderFollowedGroup(ports.follows)(viewingUserId)),
  )),
  T.map(renderFollowList),
  TE.rightTask,
);
