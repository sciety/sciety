import {
  DomainEvent, RuntimeGeneratedEvent, UserFoundReviewHelpfulEvent, UserRevokedFindingReviewHelpfulEvent,
} from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

type RevokeResponse = (userId: UserId, reviewId: ReviewId) => Promise<ReadonlyArray<RuntimeGeneratedEvent>>;

type InterestingEvent =
  | UserFoundReviewHelpfulEvent
  | UserRevokedFindingReviewHelpfulEvent
  | UserFoundReviewHelpfulEvent
  | UserRevokedFindingReviewHelpfulEvent;

export const revokeResponse = (getAllEvents: GetAllEvents): RevokeResponse => async (userId, reviewId) => {
  const ofInterest = (await getAllEvents())
    // TODO: deduplicate filtering with other command(s) and factor out tests that duplicate this logic
    .filter(
      (event): event is InterestingEvent => (
        event.type === 'UserFoundReviewHelpful'
        || event.type === 'UserRevokedFindingReviewHelpful'
        || event.type === 'UserFoundReviewNotHelpful'
        || event.type === 'UserRevokedFindingReviewNotHelpful'
      ),
    )
    .filter((event) => event.userId === userId && event.reviewId.toString() === reviewId.toString());

  if (ofInterest.length === 0) {
    return [];
  }
  const typeOfMostRecentEvent = ofInterest[ofInterest.length - 1].type;
  if (typeOfMostRecentEvent === 'UserRevokedFindingReviewHelpful') {
    return [];
  }
  const typeOfGeneratedEvent = (typeOfMostRecentEvent === 'UserFoundReviewHelpful')
    ? 'UserRevokedFindingReviewHelpful'
    : 'UserRevokedFindingReviewNotHelpful';
  return [
    {
      id: generate(),
      type: typeOfGeneratedEvent,
      date: new Date(),
      userId,
      reviewId,
    },
  ];
};
