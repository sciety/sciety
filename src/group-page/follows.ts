import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events';
import { getGroupIdsFollowedBy } from '../shared-read-models/followings';
import { GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

type Follows = (u: UserId, g: GroupId) => (events: ReadonlyArray<DomainEvent>) => boolean;

export const follows: Follows = (userId, groupId) => (events) => pipe(
  events,
  getGroupIdsFollowedBy(userId),
  A.findFirst((gid) => gid === groupId),
  O.isSome,
);
