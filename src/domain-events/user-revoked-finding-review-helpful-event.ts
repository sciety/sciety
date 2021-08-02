import { EventId, generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type UserRevokedFindingReviewHelpfulEvent = Readonly<{
  id: EventId,
  type: 'UserRevokedFindingReviewHelpful',
  date: Date,
  userId: UserId,
  reviewId: ReviewId,
}>;

export const userRevokedFindingReviewHelpful = (
  userId: UserId,
  reviewId: ReviewId,
): UserRevokedFindingReviewHelpfulEvent => ({
  id: generate(),
  type: 'UserRevokedFindingReviewHelpful',
  date: new Date(),
  userId,
  reviewId,
});
