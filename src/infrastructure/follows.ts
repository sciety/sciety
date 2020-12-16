import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type Follows = (userId: UserId, editorialCommunityId: EditorialCommunityId) => T.Task<boolean>;

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const isFollowing = (
  userId: UserId,
  editorialCommunityId: EditorialCommunityId,
) => (events: ReadonlyArray<DomainEvent>): boolean => {
  const result = new Set<string>();
  events.forEach((event) => {
    if (event.type === 'UserFollowedEditorialCommunity' && event.userId === userId) {
      result.add(event.editorialCommunityId.value);
    } else if (event.type === 'UserUnfollowedEditorialCommunity' && event.userId === userId) {
      result.delete(event.editorialCommunityId.value);
    }
  });
  return Array.from(result).some((item) => item === editorialCommunityId.value);
};

export default (getAllEvents: GetAllEvents): Follows => (
  (userId, editorialCommunityId) => (
    pipe(
      getAllEvents,
      T.map(isFollowing(userId, editorialCommunityId)),
    )
  )
);
