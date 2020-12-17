import * as T from 'fp-ts/lib/Task';
import { CountReviewResponses } from './render-review-responses';
import {
  DomainEvent,
  UserFoundReviewHelpfulEvent, UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../types/domain-events';

export type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

export default (getEvents: GetEvents): CountReviewResponses => (
  async (reviewId) => {
    const allEvents = await getEvents();
    const helpfulCount = allEvents
      .filter((event): event is UserFoundReviewHelpfulEvent | UserRevokedFindingReviewHelpfulEvent => (
        event.type === 'UserFoundReviewHelpful' || event.type === 'UserRevokedFindingReviewHelpful'
      ))
      .filter((event) => event.reviewId.toString() === reviewId.toString())
      .reduce((count, event) => (
        event.type === 'UserFoundReviewHelpful' ? count + 1 : count - 1
      ), 0);

    const notHelpfulCount = allEvents
      .filter((event): event is UserFoundReviewNotHelpfulEvent | UserRevokedFindingReviewNotHelpfulEvent => (
        event.type === 'UserFoundReviewNotHelpful' || event.type === 'UserRevokedFindingReviewNotHelpful'
      ))
      .filter((event) => event.reviewId.toString() === reviewId.toString())
      .reduce((count, event) => (
        event.type === 'UserFoundReviewNotHelpful' ? count + 1 : count - 1
      ), 0);

    return { helpfulCount, notHelpfulCount };
  }
);
