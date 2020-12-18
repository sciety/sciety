import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { GetFollowedEditorialCommunityIds } from './get-followed-editorial-communities-from-ids';
import { DomainEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import { UserId } from '../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const projectFollowedCommunities = (userId: UserId) => (events: ReadonlyArray<DomainEvent>) => {
  const result = new Set<string>();
  events.forEach((event) => {
    if (event.type === 'UserFollowedEditorialCommunity' && event.userId === userId) {
      result.add(event.editorialCommunityId.value);
    } else if (event.type === 'UserUnfollowedEditorialCommunity' && event.userId === userId) {
      result.delete(event.editorialCommunityId.value);
    }
  });
  return Array.from(result);
};

export default (getAllEvents: GetAllEvents): GetFollowedEditorialCommunityIds => (
  (userId) => (
    pipe(
      getAllEvents,
      T.map(projectFollowedCommunities(userId)),
      T.map((communities) => communities.map((id: string) => new EditorialCommunityId(id))),
    )
  )
);
