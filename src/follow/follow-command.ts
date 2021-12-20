import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { isFollowing } from './event-sourced-follow-list-repository';
import { DomainEvent, userFollowedEditorialCommunity, UserFollowedEditorialCommunityEvent } from '../domain-events';
import { GroupId } from '../types/group-id';
import { User } from '../types/user';

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: (events: ReadonlyArray<UserFollowedEditorialCommunityEvent>) => T.Task<void>,
};

export const followCommand = (ports: Ports) => (user: User, groupId: GroupId): T.Task<void> => pipe(
  ports.getAllEvents,
  T.map(isFollowing(user.id, groupId)),
  T.map(B.fold(
    () => [userFollowedEditorialCommunity(user.id, groupId)],
    () => [],
  )),
  T.chain(ports.commitEvents),
);
