import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { isFollowing } from './is-following';
import { userUnfollowedEditorialCommunity } from '../../domain-events';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';
import { CommandHandler } from '../../types/command-handler';

export type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type UnfollowCommand = {
  userId: UserId,
  groupId: GroupId,
};

type UnfollowCommandHandler = CommandHandler<UnfollowCommand>;

export const unfollowCommandHandler = (ports: Ports): UnfollowCommandHandler => (command) => pipe(
  ports.getAllEvents,
  T.map(isFollowing(command.userId, command.groupId)),
  T.map(B.fold(
    () => [],
    () => [userUnfollowedEditorialCommunity(command.userId, command.groupId)],
  )),
  T.chain(ports.commitEvents),
  TE.rightTask,
);
