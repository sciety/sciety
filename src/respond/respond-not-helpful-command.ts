import { DomainEvent, UserFoundReviewNotHelpfulEvent, UserRevokedFindingReviewNotHelpfulEvent } from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

type RespondNotHelpful = (userId: UserId, reviewId: ReviewId) => Promise<
ReadonlyArray<UserFoundReviewNotHelpfulEvent>
>;

export const respondNotHelpful = (getAllEvents: GetAllEvents): RespondNotHelpful => async (userId, reviewId) => {
  const events = await getAllEvents();
  const priorEvents = events
    .filter(
      (event): event is UserFoundReviewNotHelpfulEvent | UserRevokedFindingReviewNotHelpfulEvent => (
        event.type === 'UserFoundReviewNotHelpful' || event.type === 'UserRevokedFindingReviewNotHelpful'
      ),
    )
    .filter((event) => (
      event.reviewId.toString() === reviewId.toString() && event.userId === userId
    ));

  const notHelpfulState = priorEvents.length > 0 && priorEvents[priorEvents.length - 1].type === 'UserFoundReviewNotHelpful';

  if (notHelpfulState) {
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
