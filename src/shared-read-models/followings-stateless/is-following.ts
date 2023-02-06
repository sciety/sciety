import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { getGroupIdsFollowedBy } from './get-group-ids-followed-by';
import { DomainEvent } from '../../domain-events';
import { GroupId } from '../../types/group-id';
import { UserId } from '../../types/user-id';

type IsFollowing = (u: UserId, g: GroupId) => (events: ReadonlyArray<DomainEvent>) => boolean;

export const isFollowing: IsFollowing = (userId, groupId) => (events) => pipe(
  events,
  getGroupIdsFollowedBy(userId),
  RA.findFirst((gid) => gid === groupId),
  O.isSome,
);
