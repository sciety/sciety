import { GetUserVote } from './render-review-responses';
import { DomainEvent, UserFoundReviewHelpfulEvent } from '../types/domain-events';

type GetEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export default (getEvents: GetEvents): GetUserVote => (
  async (reviewId, userId) => {
    if (userId.isNothing()) {
      return 'not';
    }

    const events = await getEvents();

    // TODO number of filters could be reduced
    const voteEvents = events
      .filter((event): event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful')
      .filter((event) => event.userId === userId.unsafelyUnwrap())
      .filter((event) => event.reviewId.toString() === reviewId.toString());

    return voteEvents.length > 0 ? 'up' : 'not';
  }
);
