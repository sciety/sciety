import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { DomainEvent, isUserFollowedEditorialCommunityEvent, isUserUnfollowedEditorialCommunityEvent } from '../types/domain-events';
import { eqGroupId, GroupId } from '../types/group-id';
import { UserId } from '../types/user-id';

export type Follows = (userId: UserId, editorialCommunityId: GroupId) => T.Task<boolean>;

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

export const follows = (getAllEvents: GetAllEvents): Follows => (
  (userId, editorialCommunityId) => (
    pipe(
      getAllEvents,
      T.map(
        flow(
          A.filter(isSignificantTo(userId, editorialCommunityId)),
          A.last,
          O.fold(
            () => false,
            (event) => isUserFollowedEditorialCommunityEvent(event),
          ),
        ),
      ),
    )
  )
);
