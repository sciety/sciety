import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { CountReviewResponses } from './render-review-responses';
import {
  DomainEvent,
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../types/domain-events';
import * as ReviewId from '../types/review-id';

type GetEvents = T.Task<ReadonlyArray<DomainEvent>>;

const projection = (reviewId: ReviewId.ReviewId) => (events: ReadonlyArray<DomainEvent>) => {
  const helpfulCount = pipe(
    events,
    RA.filter((event): event is UserFoundReviewHelpfulEvent | UserRevokedFindingReviewHelpfulEvent => (
      event.type === 'UserFoundReviewHelpful' || event.type === 'UserRevokedFindingReviewHelpful'
    )),
    RA.filter((event) => ReviewId.equals(event.reviewId, reviewId)),
    RA.reduce(0, (count, event) => (
      event.type === 'UserFoundReviewHelpful' ? count + 1 : count - 1
    )),
  );

  const notHelpfulCount = pipe(
    events,
    RA.filter((event): event is UserFoundReviewNotHelpfulEvent | UserRevokedFindingReviewNotHelpfulEvent => (
      event.type === 'UserFoundReviewNotHelpful' || event.type === 'UserRevokedFindingReviewNotHelpful'
    )),
    RA.filter((event) => ReviewId.equals(event.reviewId, reviewId)),
    RA.reduce(0, (count, event) => (
      event.type === 'UserFoundReviewNotHelpful' ? count + 1 : count - 1
    )),
  );

  return { helpfulCount, notHelpfulCount };
};

export const createProjectReviewResponseCounts = (getEvents: GetEvents): CountReviewResponses => (reviewId) => pipe(
  getEvents,
  T.map(projection(reviewId)),
);
