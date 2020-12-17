import { Middleware } from '@koa/router';
import { BadRequest } from 'http-errors';
import { commandHandler, CommitEvents } from './command-handler';
import { GetAllEvents } from './respond-helpful-command';
import toReviewId from '../types/review-id';
import { User } from '../types/user';

type Ports = {
  commitEvents: CommitEvents;
  getAllEvents: GetAllEvents;
};

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
