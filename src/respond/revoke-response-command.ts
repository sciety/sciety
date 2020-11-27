import * as T from 'fp-ts/lib/Task';
import { flow, pipe } from 'fp-ts/lib/function';
import {
  DomainEvent,
  RuntimeGeneratedEvent,
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../types/domain-events';
import { generate } from '../types/event-id';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type RevokeResponse = (userId: UserId, reviewId: ReviewId) => T.Task<ReadonlyArray<RuntimeGeneratedEvent>>;

type InterestingEvent =
  | UserFoundReviewHelpfulEvent
  | UserRevokedFindingReviewHelpfulEvent
  | UserFoundReviewNotHelpfulEvent
  | UserRevokedFindingReviewNotHelpfulEvent;

type Response = 'none' | 'helpful' | 'not-helpful';

const filterEventType = (events: ReadonlyArray<DomainEvent>): ReadonlyArray<InterestingEvent> => (
  events.filter(
    (event): event is InterestingEvent => (
      event.type === 'UserFoundReviewHelpful'
      || event.type === 'UserRevokedFindingReviewHelpful'
      || event.type === 'UserFoundReviewNotHelpful'
      || event.type === 'UserRevokedFindingReviewNotHelpful'
    ),
  ));

const filterUserAndReview = (
  userId: UserId,
  reviewId: ReviewId,
) => (events: ReadonlyArray<InterestingEvent>): ReadonlyArray<InterestingEvent> => (
  events.filter((event) => event.userId === userId && event.reviewId.toString() === reviewId.toString())
);

const translateEventsToResponse = (events: ReadonlyArray<InterestingEvent>): Response => {
  // TODO: fold if into switch
  if (events.length === 0) {
    return 'none';
  }
  const typeOfMostRecentEvent = events[events.length - 1].type;

  switch (typeOfMostRecentEvent) {
    case 'UserRevokedFindingReviewHelpful':
      return 'none';
    case 'UserRevokedFindingReviewNotHelpful':
      return 'none';
    case 'UserFoundReviewHelpful':
      return 'helpful';
    case 'UserFoundReviewNotHelpful':
      return 'not-helpful';
  }
};

const handleCommand = (userId: UserId, reviewId: ReviewId) => (response: Response): ReadonlyArray<InterestingEvent> => {
  switch (response) {
    case 'none':
      return [];
    case 'helpful':
      return [
        {
          id: generate(),
          type: 'UserRevokedFindingReviewHelpful',
          date: new Date(),
          userId,
          reviewId,
        },
      ];
    case 'not-helpful':
      return [
        {
          id: generate(),
          type: 'UserRevokedFindingReviewNotHelpful',
          date: new Date(),
          userId,
          reviewId,
        },
      ];
  }
};

type Command = (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<InterestingEvent>;

const command = (userId: UserId, reviewId: ReviewId): Command => flow(
  filterEventType,
  filterUserAndReview(userId, reviewId),
  translateEventsToResponse,
  handleCommand(userId, reviewId),
);

export const revokeResponse = (getAllEvents: GetAllEvents): RevokeResponse => (userId, reviewId) => (
  pipe(
    getAllEvents,
    T.map(command(userId, reviewId)),
  )
);
