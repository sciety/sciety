import * as T from 'fp-ts/lib/Task';
import { IsFollowingSomething } from './render-feed';
import { DomainEvent } from '../types/domain-events';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export default (getAllEvents: GetAllEvents): IsFollowingSomething => (
  (userId) => async () => {
    let count = 0;
    (await getAllEvents()).forEach((event) => {
      if (event.type === 'UserFollowedEditorialCommunity' && event.userId === userId) {
        count += 1;
      } else if (event.type === 'UserUnfollowedEditorialCommunity' && event.userId === userId) {
        count -= 1;
      }
    });
    return count > 0;
  }
);
