import { ReviewResponse } from './review-response';
import {
  RuntimeGeneratedEvent,
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

type RevokeResponse = (userId: UserId, reviewId: ReviewId) => ReadonlyArray<RuntimeGeneratedEvent>;

// TODO: this should only produce revoke events
type InterestingEvent =
  | UserFoundReviewHelpfulEvent
  | UserRevokedFindingReviewHelpfulEvent
  | UserFoundReviewNotHelpfulEvent
  | UserRevokedFindingReviewNotHelpfulEvent;

const handleCommand = (
  userId: UserId,
  reviewId: ReviewId,
) => (response: ReviewResponse): ReadonlyArray<InterestingEvent> => {
  switch (response) {
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

export const revokeResponse = (currentResponse: 'helpful' | 'not-helpful' | 'none'): RevokeResponse => (userId, reviewId) => handleCommand(userId, reviewId)(currentResponse);
