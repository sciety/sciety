import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { isString } from 'is-what';
import { respondHelpful } from './respond-helpful-command';
import { respondNotHelpful } from './respond-not-helpful-command';
import { reviewResponse } from './review-response';
import { revokeResponse } from './revoke-response-command';
import {
  DomainEvent,
  UserFoundReviewHelpfulEvent,
  UserFoundReviewNotHelpfulEvent,
  UserRevokedFindingReviewHelpfulEvent,
  UserRevokedFindingReviewNotHelpfulEvent,
} from '../domain-events';
import { ReviewId } from '../types/review-id';
import { UserId } from '../types/user-id';

export type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

const commands = {
  'respond-helpful': respondHelpful,
  'respond-not-helpful': respondNotHelpful,
  'revoke-response': revokeResponse,
};

type Command = keyof typeof commands;

const isCommand = (command: string): command is Command => command in commands;

export const toCommand = flow(
  O.of,
  O.filter(isString),
  O.filter(isCommand),
);

type GeneratedEvents = (
  UserFoundReviewHelpfulEvent |
  UserFoundReviewNotHelpfulEvent |
  UserRevokedFindingReviewHelpfulEvent |
  UserRevokedFindingReviewNotHelpfulEvent
);

type CommandHandler = (input: { command: Command, reviewId: ReviewId }) => T.Task<ReadonlyArray<GeneratedEvents>>;

export const commandHandler = (
  getAllEvents: GetAllEvents,
  userId: UserId,
): CommandHandler => ({
  command,
  reviewId,
}) => pipe(
  getAllEvents,
  T.map(reviewResponse(userId, reviewId)),
  T.map((currentResponse) => commands[command](currentResponse, userId, reviewId)),
);
