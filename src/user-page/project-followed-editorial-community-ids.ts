import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { GetFollowedEditorialCommunityIds } from './get-followed-editorial-communities-from-ids';
import { DomainEvent } from '../types/domain-events';
import { EditorialCommunityId } from '../types/editorial-community-id';
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

  return pipe(
    [...result],
    RA.map((id) => new EditorialCommunityId(id)),
  );
};

export const createProjectFollowedEditorialCommunityIds = (
  getAllEvents: GetAllEvents,
): GetFollowedEditorialCommunityIds => (
  (userId) => pipe(
    getAllEvents,
    T.map(projectFollowedCommunities(userId)),
  )
);
