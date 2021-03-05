import * as O from 'fp-ts/Option';
import * as RT from 'fp-ts/ReaderTask';
import * as A from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow } from 'fp-ts/function';
import { DomainEvent, isUserFollowedEditorialCommunityEvent, isUserUnfollowedEditorialCommunityEvent } from '../types/domain-events';
import { eqGroupId, GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

type Follows = (userId: UserId, editorialCommunityId: GroupId) => RT.ReaderTask<GetAllEvents, boolean>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const isSignificantTo = (
  userId: UserId,
  editorialCommunityId: GroupId,
) => (event: DomainEvent) => (
  (isUserFollowedEditorialCommunityEvent(event)
    && eqGroupId.equals(event.editorialCommunityId, editorialCommunityId)
    && event.userId === userId)
  || (isUserUnfollowedEditorialCommunityEvent(event)
    && eqGroupId.equals(event.editorialCommunityId, editorialCommunityId)
    && event.userId === userId)
);

export const follows: Follows = (userId, editorialCommunityId) => (
  T.map(flow(
    A.filter(isSignificantTo(userId, editorialCommunityId)),
    A.last,
    O.fold(
      () => false,
      (event) => isUserFollowedEditorialCommunityEvent(event),
    ),
  ))
);
