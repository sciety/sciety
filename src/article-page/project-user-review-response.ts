import { Maybe } from 'true-myth';
import { GetUserReviewResponse } from './render-review-responses';
import { DomainEvent, UserFoundReviewHelpfulEvent, UserRevokedFindingReviewHelpfulEvent } from '../types/domain-events';

export type GetEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export default (getEvents: GetEvents): GetUserReviewResponse => (
  async (reviewId, userId) => {
    if (userId.isNothing()) {
      return Maybe.nothing();
    }

    const events = await getEvents();

    // TODO number of filters could be reduced
    const ofInterest = events
      .filter((event): event is UserFoundReviewHelpfulEvent | UserRevokedFindingReviewHelpfulEvent => (
        event.type === 'UserFoundReviewHelpful' || event.type === 'UserRevokedFindingReviewHelpful'
      ))
      .filter((event) => event.userId === userId.unsafelyUnwrap())
      .filter((event) => event.reviewId.toString() === reviewId.toString());

    if (ofInterest.length === 0) {
      return Maybe.nothing();
    }

    const mostRecentEventType = events[events.length - 1].type;
    return mostRecentEventType === 'UserFoundReviewHelpful' ? Maybe.just('helpful') : Maybe.nothing();
  }
);
