import {
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
} from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

type RespondNotHelpful = (userId: UserId, reviewId: ReviewId) => Promise<
ReadonlyArray<UserRevokedFindingReviewHelpfulEvent | UserFoundReviewNotHelpfulEvent>
>;

export const respondNotHelpful = (currentResponse: 'helpful' | 'not-helpful' | 'none'): RespondNotHelpful => async (userId, reviewId) => {
  switch (currentResponse) {
    case 'none':
      return [
        {
          id: generate(),
          type: 'UserFoundReviewNotHelpful',
          date: new Date(),
          userId,
          reviewId,
        },
      ];
    case 'not-helpful':
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
        {
          id: generate(),
          type: 'UserFoundReviewNotHelpful',
          date: new Date(),
          userId,
          reviewId,
        },
      ];
  }
};
