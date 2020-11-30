import { Middleware } from '@koa/router';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { BadRequest } from 'http-errors';
import { GetAllEvents, respondHelpful } from './respond-helpful-command';
import { respondNotHelpful } from './respond-not-helpful-command';
import { reviewResponse } from './review-response';
import { revokeResponse } from './revoke-response-command';
import { RuntimeGeneratedEvent } from '../types/domain-events';
import toReviewId from '../types/review-id';
import { User } from '../types/user';

type CommitEvents = (events: ReadonlyArray<RuntimeGeneratedEvent>) => void;

type Ports = {
  commitEvents: CommitEvents;
  getAllEvents: GetAllEvents;
};

export default (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const { user } = context.state;
  const reviewId = toReviewId(context.request.body.reviewid);

  const command = context.request.body.command as string;
  if (command !== 'respond-helpful' && command !== 'revoke-response' && command !== 'respond-not-helpful') {
    throw new BadRequest();
  }

  const commands = {
    'respond-helpful': respondHelpful,
    'respond-not-helpful': respondNotHelpful,
    'revoke-response': revokeResponse,
  };

  await pipe(
    ports.getAllEvents,
    T.map(reviewResponse(user.id, reviewId)),
    T.map((currentResponse) => commands[command](currentResponse, user.id, reviewId)),
    T.map(ports.commitEvents),
  )();

  context.redirect('back');

  await next();
};
