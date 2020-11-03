import { CountReviewResponses } from './render-review-responses';
import { DomainEvent, UserFoundReviewHelpfulEvent, UserRevokedFindingReviewHelpfulEvent } from '../types/domain-events';

export type GetEvents = () => Promise<ReadonlyArray<DomainEvent>>;

export default (getEvents: GetEvents): CountReviewResponses => (
  async (reviewId) => {
    const helpfulCount = (await getEvents())
      .filter((event): event is UserFoundReviewHelpfulEvent | UserRevokedFindingReviewHelpfulEvent => (
        event.type === 'UserFoundReviewHelpful' || event.type === 'UserRevokedFindingReviewHelpful'
      ))
      .filter((event) => event.reviewId.toString() === reviewId.toString())
      .reduce((count, event) => (
        event.type === 'UserFoundReviewHelpful' ? count + 1 : count - 1
      ), 0);

    return { helpfulCount, notHelpfulCount: 0 };
  }
);
