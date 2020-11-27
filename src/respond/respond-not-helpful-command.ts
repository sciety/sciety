import { reviewResponse } from './review-response';
import { DomainEvent, UserFoundReviewNotHelpfulEvent } from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

type RespondNotHelpful = (userId: UserId, reviewId: ReviewId) => Promise<
ReadonlyArray<UserFoundReviewNotHelpfulEvent>
>;

export const respondNotHelpful = (getAllEvents: GetAllEvents): RespondNotHelpful => async (userId, reviewId) => {
  const events = await getAllEvents();
  const currentResponse = reviewResponse(userId, reviewId)(events);

  if (currentResponse === 'not-helpful') {
    return [];
  }

  return [
    {
      id: generate(),
      type: 'UserFoundReviewNotHelpful',
      date: new Date(),
      userId,
      reviewId,
    },
  ];
};
