import {
  DomainEvent,
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type GetAllEvents = () => Promise<ReadonlyArray<DomainEvent>>;

type RespondHelpful = (userId: UserId, reviewId: ReviewId) => Promise<
ReadonlyArray<UserFoundReviewHelpfulEvent>
>;

type InterestingEvent =
  | UserFoundReviewHelpfulEvent
  | UserRevokedFindingReviewHelpfulEvent
  | UserFoundReviewNotHelpfulEvent
  | UserRevokedFindingReviewNotHelpfulEvent;

type Response = 'none' | 'helpful' | 'not-helpful';

export const respondHelpful = (getAllEvents: GetAllEvents): RespondHelpful => async (userId, reviewId) => {
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

  let response: Response;

  // TODO: fold if else into switch
  if (ofInterest.length === 0) {
    response = 'none';
  } else {
    const typeOfMostRecentEvent = ofInterest[ofInterest.length - 1].type;

    switch (typeOfMostRecentEvent) {
      case 'UserRevokedFindingReviewHelpful':
        response = 'none';
        break;
      case 'UserRevokedFindingReviewNotHelpful':
        response = 'none';
        break;
      case 'UserFoundReviewHelpful':
        response = 'helpful';
        break;
      case 'UserFoundReviewNotHelpful':
        response = 'not-helpful';
        break;
    }
  }

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
