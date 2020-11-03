import { CountReviewResponses } from './render-review-responses';
import { DomainEvent, UserFoundReviewHelpfulEvent } from '../types/domain-events';

export type GetEvents = () => Promise<ReadonlyArray<DomainEvent>>;

// TODO: this function has no tests
export default (getEvents: GetEvents): CountReviewResponses => (
  async (reviewId) => {
    const helpfulCount = (await getEvents())
      .filter((event): event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful')
      .filter((event) => event.reviewId.toString() === reviewId.toString())
      .length;
    return { helpfulCount, notHelpfulCount: 0 };
  }
);
