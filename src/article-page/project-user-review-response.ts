import { Maybe } from 'true-myth';
import { GetUserReviewResponse } from './render-review-responses';
import { DomainEvent, UserFoundReviewHelpfulEvent } from '../types/domain-events';

type GetEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export default (getEvents: GetEvents): GetUserReviewResponse => (
  async (reviewId, userId) => {
    if (userId.isNothing()) {
      return Maybe.nothing();
    }

    const events = await getEvents();

    // TODO number of filters could be reduced
    const helpfulReviewResponseEvents = events
      .filter((event): event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful')
      .filter((event) => event.userId === userId.unsafelyUnwrap())
      .filter((event) => event.reviewId.toString() === reviewId.toString());

    return helpfulReviewResponseEvents.length > 0 ? Maybe.just('helpful') : Maybe.nothing();
  }
);
