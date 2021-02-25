import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { DomainEvent } from '../types/domain-events';
import { EditorialCommunityId, eqEditorialCommunityId } from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => T.Task<boolean>;

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const isSignificantTo = (
  userId: UserId,
  editorialCommunityId: EditorialCommunityId,
) => (event: DomainEvent) => (
  (event.type === 'UserFollowedEditorialCommunity'
    && eqEditorialCommunityId.equals(event.editorialCommunityId, editorialCommunityId)
    && event.userId === userId)
  || (event.type === 'UserUnfollowedEditorialCommunity'
    && eqEditorialCommunityId.equals(event.editorialCommunityId, editorialCommunityId)
    && event.userId === userId)
);

export const createFollows = (getAllEvents: GetAllEvents): Follows => (
  (userId, editorialCommunityId) => (
    pipe(
      getAllEvents,
      T.map(
        flow(
          A.filter(isSignificantTo(userId, editorialCommunityId)),
          A.last,
          O.fold(
            () => false,
            (event) => event.type === 'UserFollowedEditorialCommunity',
          ),
        ),
      ),
    )
  )
);
