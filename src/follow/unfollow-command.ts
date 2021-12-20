import * as T from 'fp-ts/Task';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { isFollowing } from './event-sourced-follow-list-repository';
import { DomainEvent, userUnfollowedEditorialCommunity, UserUnfollowedEditorialCommunityEvent } from '../domain-events';
import { GroupId } from '../types/group-id';
import { User } from '../types/user';

type CommitEvents = (events: ReadonlyArray<UserUnfollowedEditorialCommunityEvent>) => T.Task<void>;

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

type UnfollowCommand = (user: User, groupId: GroupId) => T.Task<void>;

export const unfollowCommand = (ports: Ports): UnfollowCommand => (user, groupId) => pipe(
  ports.getAllEvents,
  T.map(isFollowing(user.id, groupId)),
  T.map(B.fold(
    () => [],
    () => [userUnfollowedEditorialCommunity(user.id, groupId)],
  )),
  T.chain(ports.commitEvents),
);
