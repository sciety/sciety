import { reviewResponse } from './review-response';
import {
  DomainEvent,
  UserFoundReviewHelpfulEvent,
} from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

type RespondHelpful = (userId: UserId, reviewId: ReviewId) => Promise<
ReadonlyArray<UserFoundReviewHelpfulEvent>
>;

export const respondHelpful = (getAllEvents: GetAllEvents): RespondHelpful => async (userId, reviewId) => {
  const ofInterest = (await getAllEvents());
  const response = reviewResponse(userId, reviewId)(ofInterest);

  if (response === 'helpful') {
    return [];
  }

  return [
    {
      id: generate(),
      type: 'UserFoundReviewHelpful',
      date: new Date(),
      userId,
      reviewId,
    },
  ];
};
