import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { isFollowing } from './is-following';
import { DomainEvent, userFollowedEditorialCommunity, UserFollowedEditorialCommunityEvent } from '../domain-events';
import { CommandResult } from '../types/command-result';
import { GroupId } from '../types/group-id';
import { User } from '../types/user';

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: (events: ReadonlyArray<UserFollowedEditorialCommunityEvent>) => T.Task<CommandResult>,
};

export const followCommand = (ports: Ports) => (user: User, groupId: GroupId): T.Task<CommandResult> => pipe(
  ports.getAllEvents,
  T.map(isFollowing(user.id, groupId)),
  T.map(B.fold(
    () => [userFollowedEditorialCommunity(user.id, groupId)],
    () => [],
  )),
  T.chain(ports.commitEvents),
);
