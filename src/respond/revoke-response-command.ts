import * as T from 'fp-ts/lib/Task';
import { flow, pipe } from 'fp-ts/lib/function';
import { reviewResponse } from './review-response';
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

type ReviewResponse = 'none' | 'helpful' | 'not-helpful';

const handleCommand = (
  userId: UserId,
  reviewId: ReviewId,
) => (response: ReviewResponse): ReadonlyArray<InterestingEvent> => {
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
  reviewResponse(userId, reviewId),
  handleCommand(userId, reviewId),
);

export const revokeResponse = (getAllEvents: GetAllEvents): RevokeResponse => (userId, reviewId) => (
  pipe(
    getAllEvents,
    T.map(command(userId, reviewId)),
  )
);
