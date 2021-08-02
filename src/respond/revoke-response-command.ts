import { ReviewResponse } from './review-response';
import {
  userRevokedFindingReviewHelpful,
  UserRevokedFindingReviewHelpfulEvent,
  userRevokedFindingReviewNotHelpful,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../domain-events';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

type RevokeResponse = (currentResponse: ReviewResponse, userId: UserId, reviewId: ReviewId) =>
ReadonlyArray<UserRevokedFindingReviewHelpfulEvent | UserRevokedFindingReviewNotHelpfulEvent>;

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
