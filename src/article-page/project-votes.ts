import { GetVotes } from './render-review-responses';
import Doi from '../types/doi';
import { DomainEvent, UserFoundReviewHelpfulEvent } from '../types/domain-events';

export type GetEvents = () => Promise<ReadonlyArray<DomainEvent>>;

// TODO: this function has no tests
export default (getEvents: GetEvents): GetVotes => (
  async (reviewId) => {
    const helpfulCount = (await getEvents())
      .filter((event): event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful')
      .filter((event) => event.reviewId.toString() === reviewId.toString())
      .length;
    if (reviewId instanceof Doi) {
      return { helpfulCount, notHelpfulCount: 8 };
    }
    return { helpfulCount, notHelpfulCount: 9 };
  }
);
