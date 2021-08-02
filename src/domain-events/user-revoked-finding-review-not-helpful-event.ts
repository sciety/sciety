import { EventId, generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type UserRevokedFindingReviewNotHelpfulEvent = Readonly<{
  id: EventId,
  type: 'UserRevokedFindingReviewNotHelpful',
  date: Date,
  userId: UserId,
  reviewId: ReviewId,
}>;

export const userRevokedFindingReviewNotHelpful = (
  userId: UserId,
  reviewId: ReviewId,
): UserRevokedFindingReviewNotHelpfulEvent => ({
  id: generate(),
  type: 'UserRevokedFindingReviewNotHelpful',
  date: new Date(),
  userId,
  reviewId,
});
