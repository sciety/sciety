import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { isFollowing } from './is-following';
import { DomainEvent, userFollowedEditorialCommunity } from '../../domain-events';
import { CommitEvents } from '../../shared-ports';
import { CommandResult } from '../../types/command-result';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

export const followCommand = (ports: Ports) => (userId: UserId, groupId: GroupId): T.Task<CommandResult> => pipe(
  ports.getAllEvents,
  T.map(isFollowing(userId, groupId)),
  T.map(B.fold(
    () => [userFollowedEditorialCommunity(userId, groupId)],
    () => [],
  )),
  T.chain(ports.commitEvents),
);
