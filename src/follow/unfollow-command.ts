import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { createEventSourceFollowListRepository } from './event-sourced-follow-list-repository';
import { DomainEvent, UserUnfollowedEditorialCommunityEvent } from '../domain-events';
import { GroupId } from '../types/group-id';
import { User } from '../types/user';

type CommitEvents = (events: ReadonlyArray<UserUnfollowedEditorialCommunityEvent>) => T.Task<void>;

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

type UnfollowCommand = (user: User, groupId: GroupId) => T.Task<void>;

export const unfollowCommand = (ports: Ports): UnfollowCommand => (user, groupId) => pipe(
  user.id,
  createEventSourceFollowListRepository(ports.getAllEvents),
  T.map((followList) => followList.unfollow(groupId)),
  T.chain(ports.commitEvents),
);
