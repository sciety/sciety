import { EventId, generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type UserFoundReviewNotHelpfulEvent = Readonly<{
  id: EventId,
  type: 'UserFoundReviewNotHelpful',
  date: Date,
  userId: UserId,
  reviewId: ReviewId,
}>;

export const userFoundReviewNotHelpful = (
  userId: UserId,
  reviewId: ReviewId,
): UserFoundReviewNotHelpfulEvent => ({
  id: generate(),
  type: 'UserFoundReviewNotHelpful',
  date: new Date(),
  userId,
  reviewId,
});
