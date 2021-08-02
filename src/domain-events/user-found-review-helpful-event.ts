import { EventId, generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type UserFoundReviewHelpfulEvent = Readonly<{
  id: EventId,
  type: 'UserFoundReviewHelpful',
  date: Date,
  userId: UserId,
  reviewId: ReviewId,
}>;

export const userFoundReviewHelpful = (
  userId: UserId,
  reviewId: ReviewId,
): UserFoundReviewHelpfulEvent => ({
  id: generate(),
  type: 'UserFoundReviewHelpful',
  date: new Date(),
  userId,
  reviewId,
});
