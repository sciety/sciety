import { ReviewResponse } from './review-response';
import { UserRevokedFindingReviewHelpfulEvent, UserRevokedFindingReviewNotHelpfulEvent } from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

type RevokeResponse = (currentResponse: ReviewResponse, userId: UserId, reviewId: ReviewId) =>
ReadonlyArray<UserRevokedFindingReviewHelpfulEvent | UserRevokedFindingReviewNotHelpfulEvent>;

const userRevokedFindingReviewHelpful = (
  userId: UserId,
  reviewId: ReviewId,
): UserRevokedFindingReviewHelpfulEvent => ({
  id: generate(),
  type: 'UserRevokedFindingReviewHelpful',
  date: new Date(),
  userId,
  reviewId,
});

const userRevokedFindingReviewNotHelpful = (
  userId: UserId,
  reviewId: ReviewId,
): UserRevokedFindingReviewNotHelpfulEvent => ({
  id: generate(),
  type: 'UserRevokedFindingReviewNotHelpful',
  date: new Date(),
  userId,
  reviewId,
});

export const revokeResponse: RevokeResponse = (currentResponse, userId, reviewId) => {
  switch (currentResponse) {
    case 'none':
      return [];
    case 'helpful':
      return [
        userRevokedFindingReviewHelpful(userId, reviewId),
      ];
    case 'not-helpful':
      return [
        userRevokedFindingReviewNotHelpful(userId, reviewId),
      ];
  }
};
