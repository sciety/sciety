import { ReviewResponse } from './review-response';
import { UserRevokedFindingReviewHelpfulEvent, UserRevokedFindingReviewNotHelpfulEvent } from '../types/domain-events';
import { generate } from '../types/event-id';
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
        {
          id: generate(),
          type: 'UserRevokedFindingReviewHelpful',
          date: new Date(),
          userId,
          reviewId,
        },
      ];
    case 'not-helpful':
      return [
        {
          id: generate(),
          type: 'UserRevokedFindingReviewNotHelpful',
          date: new Date(),
          userId,
          reviewId,
        },
      ];
  }
};
