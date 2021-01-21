import * as A from 'fp-ts/lib/ReadonlyArray';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { IsFollowingSomething } from './render-feed';
import { DomainEvent } from '../types/domain-events';
import { UserId } from '../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const countFollowedCommunities = (userId: UserId) => (count: number, event: DomainEvent): number => {
  if (event.type === 'UserFollowedEditorialCommunity' && event.userId === userId) {
    return count + 1;
  }
  if (event.type === 'UserUnfollowedEditorialCommunity' && event.userId === userId) {
    return count - 1;
  }
  return count;
};

export const projectIsFollowingSomething = (getAllEvents: GetAllEvents): IsFollowingSomething => (userId) => pipe(
  getAllEvents,
  T.map(A.reduce(0, countFollowedCommunities(userId))),
  T.map((count) => count > 0),
);
