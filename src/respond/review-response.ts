import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { match } from 'ts-pattern';
import {
  DomainEvent,
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../types/domain-events';
import * as ReviewId from '../types/review-id';
import { UserId } from '../types/user-id';

export type ReviewResponse = 'none' | 'helpful' | 'not-helpful';

type ReviewResponseType = (events: ReadonlyArray<DomainEvent>) => ReviewResponse;

type InterestingEvent =
  | UserFoundReviewHelpfulEvent
  | UserRevokedFindingReviewHelpfulEvent
  | UserFoundReviewNotHelpfulEvent
  | UserRevokedFindingReviewNotHelpfulEvent;

const filterEventType = (events: ReadonlyArray<DomainEvent>) => (
  events.filter(
    (event): event is InterestingEvent => (
      event.type === 'UserFoundReviewHelpful'
      || event.type === 'UserRevokedFindingReviewHelpful'
      || event.type === 'UserFoundReviewNotHelpful'
      || event.type === 'UserRevokedFindingReviewNotHelpful'
    ),
  ));

const filterUserAndReview = (
  userId: UserId,
  reviewId: ReviewId.ReviewId,
) => (events: ReadonlyArray<InterestingEvent>) => (
  events.filter((event) => event.userId === userId && ReviewId.equals(event.reviewId, reviewId))
);

const calculateCurrentState = (events: ReadonlyArray<InterestingEvent>) => pipe(
  events,
  RA.last,
  O.fold(
    () => 'none' as const,
    (mostRecentEvent) => match(mostRecentEvent.type)
      .with('UserFoundReviewHelpful', () => 'helpful' as const)
      .with('UserFoundReviewNotHelpful', () => 'not-helpful' as const)
      .with('UserRevokedFindingReviewHelpful', () => 'none' as const)
      .with('UserRevokedFindingReviewNotHelpful', () => 'none' as const)
      .exhaustive(),
  ),
);

export const reviewResponse = (userId: UserId, reviewId: ReviewId.ReviewId): ReviewResponseType => flow(
  filterEventType,
  filterUserAndReview(userId, reviewId),
  calculateCurrentState,
);
