import * as A from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { IsFollowingSomething } from './render-feed';
import {
  DomainEvent,
  isUserFollowedEditorialCommunityEvent,
  isUserUnfollowedEditorialCommunityEvent,
} from '../../types/domain-events';
import { UserId } from '../../types/user-id';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const countFollowedCommunities = (userId: UserId) => (count: number, event: DomainEvent) => {
  if (isUserFollowedEditorialCommunityEvent(event) && event.userId === userId) {
    return count + 1;
  }
  if (isUserUnfollowedEditorialCommunityEvent(event) && event.userId === userId) {
    return count - 1;
  }
  return count;
};

export const projectIsFollowingSomething = (getAllEvents: GetAllEvents): IsFollowingSomething => (userId) => pipe(
  getAllEvents,
  T.map(flow(
    A.reduce(0, countFollowedCommunities(userId)),
    (count) => count > 0,
  )),
);
