import { ReviewResponse } from './review-response';
import {
  userRevokedFindingReviewHelpful,
  UserRevokedFindingReviewHelpfulEvent,
  userRevokedFindingReviewNotHelpful,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../../domain-events';
import { EvaluationLocator } from '../../types/evaluation-locator';
import { UserId } from '../../types/user-id';

type RevokeResponse = (currentResponse: ReviewResponse, userId: UserId, reviewId: EvaluationLocator) =>
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
