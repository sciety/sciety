import { Middleware } from '@koa/router';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { BadRequest } from 'http-errors';
import { GetAllEvents, respondHelpful } from './respond-helpful-command';
import { respondNotHelpful } from './respond-not-helpful-command';
import { reviewResponse } from './review-response';
import { revokeResponse } from './revoke-response-command';
import { RuntimeGeneratedEvent } from '../types/domain-events';
import toReviewId, { ReviewId } from '../types/review-id';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type CommitEvents = (events: ReadonlyArray<RuntimeGeneratedEvent>) => void;

type Ports = {
  commitEvents: CommitEvents;
  getAllEvents: GetAllEvents;
};

const commands = {
  'respond-helpful': respondHelpful,
  'respond-not-helpful': respondNotHelpful,
  'revoke-response': revokeResponse,
};

const commandHandler = (
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

export const createRespondHandler = (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const { user } = context.state;
  const reviewId = toReviewId(context.request.body.reviewid);

  const command = context.request.body.command as string;
  if (command !== 'respond-helpful' && command !== 'revoke-response' && command !== 'respond-not-helpful') {
    throw new BadRequest();
  }

  await commandHandler(
    ports.commitEvents,
    ports.getAllEvents,
    command,
    user.id,
    reviewId,
  )();

  context.redirect('back');

  await next();
};
