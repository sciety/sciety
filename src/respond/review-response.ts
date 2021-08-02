import { flow } from 'fp-ts/function';
import {
  DomainEvent,
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../domain-events';
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

const calculateCurrentState = (events: ReadonlyArray<InterestingEvent>) => {
  // TODO: fold if into switch
  if (events.length === 0) {
    return 'none';
  }
  const typeOfMostRecentEvent = events[events.length - 1].type;

  switch (typeOfMostRecentEvent) {
    case 'UserRevokedFindingReviewHelpful':
      return 'none';
    case 'UserRevokedFindingReviewNotHelpful':
      return 'none';
    case 'UserFoundReviewHelpful':
      return 'helpful';
    case 'UserFoundReviewNotHelpful':
      return 'not-helpful';
  }
};

export const reviewResponse = (userId: UserId, reviewId: ReviewId.ReviewId): ReviewResponseType => flow(
  filterEventType,
  filterUserAndReview(userId, reviewId),
  calculateCurrentState,
);
