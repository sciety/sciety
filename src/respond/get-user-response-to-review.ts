import { DomainEvent, UserFoundReviewHelpfulEvent } from '../types/domain-events';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';
import UserResponseToReview from '../types/user-response-to-review';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

type GetUserResponseToReview = (userId: UserId, reviewId: ReviewId) => Promise<UserResponseToReview>;

export default (
  getAllEvents: GetAllEvents,
): GetUserResponseToReview => (
  async (userId, reviewId) => {
    const events = await getAllEvents();
    const priorEvents = events
      .filter((event): event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful')
      .filter((event) => event.reviewId.toString() === reviewId.toString() && event.userId === userId);
    return new UserResponseToReview(userId, reviewId, priorEvents.length === 0 ? 'no-response' : 'helpful');
  }
);

type RespondHelpful = (userId: UserId, reviewId: ReviewId) => Promise<ReadonlyArray<UserFoundReviewHelpfulEvent>>;

export const respondHelpful = (getAllEvents: GetAllEvents): RespondHelpful => async (userId, reviewId) => {
  const events = await getAllEvents();
  const priorEvents = events
    .filter((event): event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful')
    .filter((event) => event.reviewId.toString() === reviewId.toString() && event.userId === userId);
  return new UserResponseToReview(userId, reviewId, priorEvents.length === 0 ? 'no-response' : 'helpful').respondHelpful();
};
