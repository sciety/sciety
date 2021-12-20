import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { createEventSourceFollowListRepository } from './event-sourced-follow-list-repository';
import { DomainEvent, UserFollowedEditorialCommunityEvent } from '../domain-events';
import { GroupId } from '../types/group-id';
import { User } from '../types/user';

type CommitEvents = (events: ReadonlyArray<UserFollowedEditorialCommunityEvent>) => T.Task<void>;

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

type FollowCommand = (user: User, groupId: GroupId) => T.Task<void>;

export const followCommand = (ports: Ports): FollowCommand => (
  (user, groupId) => pipe(
    user.id,
    createEventSourceFollowListRepository(ports.getAllEvents),
    T.map((followList) => followList.follow(groupId)),
    T.chain(ports.commitEvents),
  )
);
