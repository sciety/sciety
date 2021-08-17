import { ReviewResponse } from './review-response';
import {
  userFoundReviewHelpful,
  UserFoundReviewHelpfulEvent,
  userRevokedFindingReviewNotHelpful,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../domain-events';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

type RespondHelpful = (reviewResponse: ReviewResponse, userId: UserId, reviewId: ReviewId) =>
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
