import * as O from 'fp-ts/lib/Option';
import * as A from 'fp-ts/lib/ReadonlyArray';
import * as T from 'fp-ts/lib/Task';
import { flow, pipe } from 'fp-ts/lib/function';
import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => T.Task<boolean>;

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const isSignificantTo = (
  userId: UserId,
  editorialCommunityId: EditorialCommunityId,
) => (event: DomainEvent): boolean => (
  (event.type === 'UserFollowedEditorialCommunity' && event.editorialCommunityId === editorialCommunityId && event.userId === userId)
  || (event.type === 'UserUnfollowedEditorialCommunity' && event.editorialCommunityId === editorialCommunityId && event.userId === userId)
);

export default (getAllEvents: GetAllEvents): Follows => (
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
