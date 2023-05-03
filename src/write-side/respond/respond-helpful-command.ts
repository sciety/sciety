import { ReviewResponse } from './review-response';
import {
  userFoundReviewHelpful,
  UserFoundReviewHelpfulEvent,
  userRevokedFindingReviewNotHelpful,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../../domain-events';
import { EvaluationLocator } from '../../types/evaluation-locator';
import { UserId } from '../../types/user-id';

type RespondHelpful = (reviewResponse: ReviewResponse, userId: UserId, reviewId: EvaluationLocator) =>
ReadonlyArray<UserFoundReviewHelpfulEvent | UserRevokedFindingReviewNotHelpfulEvent>;

export const respondHelpful: RespondHelpful = (currentResponse, userId, reviewId) => {
  switch (currentResponse) {
    case 'none':
      return [
        userFoundReviewHelpful(userId, reviewId),
      ];
    case 'helpful':
      return [];
    case 'not-helpful':
      return [
        userRevokedFindingReviewNotHelpful(userId, reviewId),
        userFoundReviewHelpful(userId, reviewId),
      ];
  }
};
