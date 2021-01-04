import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { respondHelpful } from './respond-helpful-command';
import { respondNotHelpful } from './respond-not-helpful-command';
import { reviewResponse } from './review-response';
import { revokeResponse } from './revoke-response-command';
import { DomainEvent, RuntimeGeneratedEvent } from '../types/domain-events';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type CommitEvents = (events: ReadonlyArray<RuntimeGeneratedEvent>) => void;

const commands = {
  'respond-helpful': respondHelpful,
  'respond-not-helpful': respondNotHelpful,
  'revoke-response': revokeResponse,
};

export type ValidCommand = 'respond-helpful' | 'respond-not-helpful' | 'revoke-response';

export const validateCommand = O.fromPredicate((command): command is ValidCommand => (
  command === 'respond-helpful' || command === 'revoke-response' || command === 'respond-not-helpful'
));

export const commandHandler = (
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
  command: 'respond-helpful' | 'respond-not-helpful' | 'revoke-response',
  userId: UserId,
  reviewId: ReviewId,
): T.Task<void> => (
  pipe(
    getAllEvents,
    T.map(reviewResponse(userId, reviewId)),
    T.map((currentResponse) => commands[command](currentResponse, userId, reviewId)),
    T.map(commitEvents),
  )
);
