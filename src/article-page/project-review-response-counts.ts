import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { CountReviewResponses } from './render-review-responses';
import {
  DomainEvent,
  UserFoundReviewHelpfulEvent, UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../types/domain-events';
import { ReviewId } from '../types/review-id';

export type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

const projection = (reviewId: ReviewId) => (events: ReadonlyArray<DomainEvent>) => {
  const helpfulCount = events
    .filter((event): event is UserFoundReviewHelpfulEvent | UserRevokedFindingReviewHelpfulEvent => (
      event.type === 'UserFoundReviewHelpful' || event.type === 'UserRevokedFindingReviewHelpful'
    ))
    .filter((event) => event.reviewId.toString() === reviewId.toString())
    .reduce((count, event) => (
      event.type === 'UserFoundReviewHelpful' ? count + 1 : count - 1
    ), 0);

  const notHelpfulCount = events
    .filter((event): event is UserFoundReviewNotHelpfulEvent | UserRevokedFindingReviewNotHelpfulEvent => (
      event.type === 'UserFoundReviewNotHelpful' || event.type === 'UserRevokedFindingReviewNotHelpful'
    ))
    .filter((event) => event.reviewId.toString() === reviewId.toString())
    .reduce((count, event) => (
      event.type === 'UserFoundReviewNotHelpful' ? count + 1 : count - 1
    ), 0);

  return { helpfulCount, notHelpfulCount };
};

export default (getEvents: GetEvents): CountReviewResponses => (reviewId) => pipe(
  getEvents,
  T.map(projection(reviewId)),
);
