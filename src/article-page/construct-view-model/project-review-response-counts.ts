import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import {
  DomainEvent,
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../../domain-events';
import * as ReviewId from '../../types/review-id';

const projectHelpfulCount = (reviewId: ReviewId.ReviewId) => flow(
  RA.filter((event: DomainEvent): event is UserFoundReviewHelpfulEvent | UserRevokedFindingReviewHelpfulEvent => (
    event.type === 'UserFoundReviewHelpful' || event.type === 'UserRevokedFindingReviewHelpful'
  )),
  RA.filter((event) => ReviewId.equals(event.reviewId, reviewId)),
  RA.reduce(0, (count, event) => (
    event.type === 'UserFoundReviewHelpful' ? count + 1 : count - 1
  )),
);

const projectNotHelpfulCount = (reviewId: ReviewId.ReviewId) => flow(
  RA.filter((event: DomainEvent): event is UserFoundReviewNotHelpfulEvent | UserRevokedFindingReviewNotHelpfulEvent => (
    event.type === 'UserFoundReviewNotHelpful' || event.type === 'UserRevokedFindingReviewNotHelpful'
  )),
  RA.filter((event) => ReviewId.equals(event.reviewId, reviewId)),
  RA.reduce(0, (count, event) => (
    event.type === 'UserFoundReviewNotHelpful' ? count + 1 : count - 1
  )),
);

const projection = (reviewId: ReviewId.ReviewId) => (events: ReadonlyArray<DomainEvent>) => ({
  helpfulCount: pipe(events, projectHelpfulCount(reviewId)),
  notHelpfulCount: pipe(events, projectNotHelpfulCount(reviewId)),
});

type ProjectReviewResponseCounts = (
  reviewId: ReviewId.ReviewId,
) => (events: ReadonlyArray<DomainEvent>,
) => { helpfulCount: number, notHelpfulCount: number };

export const projectReviewResponseCounts: ProjectReviewResponseCounts = (reviewId) => (events) => pipe(
  events,
  projection(reviewId),
);
