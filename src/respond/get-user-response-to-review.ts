import { DomainEvent, UserFoundReviewHelpfulEvent, UserRevokedFindingReviewHelpfulEvent } from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';
import UserResponseToReview from '../types/user-response-to-review';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

type RespondHelpful = (userId: UserId, reviewId: ReviewId) => Promise<
ReadonlyArray<UserFoundReviewHelpfulEvent>
>;

export const respondHelpful = (getAllEvents: GetAllEvents): RespondHelpful => async (userId, reviewId) => {
  const events = await getAllEvents();
  const priorEvents = events
    .filter((event): event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful')
    .filter((event) => event.reviewId.toString() === reviewId.toString() && event.userId === userId);
  if (priorEvents.length > 0) {
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

type RevokeResponse = (userId: UserId, reviewId: ReviewId) => Promise<
ReadonlyArray<UserRevokedFindingReviewHelpfulEvent>
>;

export const revokeResponse = (getAllEvents: GetAllEvents): RevokeResponse => async (userId, reviewId) => {
  const events = await getAllEvents();
  const priorEvents = events
    .filter((event): event is UserFoundReviewHelpfulEvent => event.type === 'UserFoundReviewHelpful')
    .filter((event) => event.reviewId.toString() === reviewId.toString() && event.userId === userId);
  return new UserResponseToReview(userId, reviewId, priorEvents.length === 0 ? 'no-response' : 'helpful').revokeResponse();
};
