import * as O from 'fp-ts/Option';
import * as RT from 'fp-ts/ReaderTask';
import * as A from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow } from 'fp-ts/function';
import { DomainEvent, isUserFollowedEditorialCommunityEvent, isUserUnfollowedEditorialCommunityEvent } from '../types/domain-events';
import { GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

type Follows = (u: UserId, g: GroupId) => RT.ReaderTask<GetAllEvents, boolean>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const isSignificantTo = (
  userId: UserId,
  groupId: GroupId,
) => (event: DomainEvent) => (
  (isUserFollowedEditorialCommunityEvent(event)
    && event.editorialCommunityId === groupId
    && event.userId === userId)
  || (isUserUnfollowedEditorialCommunityEvent(event)
    && event.editorialCommunityId === groupId
    && event.userId === userId)
);

export const follows: Follows = (userId, groupId) => T.map(flow(
  A.findLast(isSignificantTo(userId, groupId)),
  O.filter(isUserFollowedEditorialCommunityEvent),
  O.isSome,
));
