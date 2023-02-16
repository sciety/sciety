import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { isFollowing } from './is-following';
import { userUnfollowedEditorialCommunity } from '../../domain-events';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandResult } from '../../types/command-result';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type UnfollowCommand = (userId: UserId, groupId: GroupId) => T.Task<CommandResult>;

export const unfollowCommand = (ports: Ports): UnfollowCommand => (userId, groupId) => pipe(
  ports.getAllEvents,
  T.map(isFollowing(userId, groupId)),
  T.map(B.fold(
    () => [],
    () => [userUnfollowedEditorialCommunity(userId, groupId)],
  )),
  T.chain(ports.commitEvents),
);
