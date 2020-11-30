import { ReviewResponse } from './review-response';
import {
  UserFoundReviewNotHelpfulEvent, userRevokedFindingReviewHelpful,
  UserRevokedFindingReviewHelpfulEvent,
} from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

type RespondNotHelpful = (currentResponse: ReviewResponse, userId: UserId, reviewId: ReviewId)
=> ReadonlyArray<UserRevokedFindingReviewHelpfulEvent | UserFoundReviewNotHelpfulEvent>;

export const respondNotHelpful: RespondNotHelpful = (currentResponse, userId, reviewId) => {
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
        userRevokedFindingReviewHelpful(userId, reviewId),
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
