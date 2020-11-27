import { reviewResponse } from './review-response';
import {
  DomainEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
} from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

type RespondNotHelpful = (userId: UserId, reviewId: ReviewId) => Promise<
ReadonlyArray<UserRevokedFindingReviewHelpfulEvent | UserFoundReviewNotHelpfulEvent>
>;

export const respondNotHelpful = (getAllEvents: GetAllEvents): RespondNotHelpful => async (userId, reviewId) => {
  const events = await getAllEvents();
  const currentResponse = reviewResponse(userId, reviewId)(events);

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
