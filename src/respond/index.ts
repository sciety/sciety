import { Middleware } from '@koa/router';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import { BadRequest } from 'http-errors';
import { commandHandler, CommitEvents } from './command-handler';
import { GetAllEvents } from './respond-helpful-command';
import toReviewId from '../types/review-id';
import { User } from '../types/user';

type Ports = {
  commitEvents: CommitEvents;
  getAllEvents: GetAllEvents;
};

type ValidCommand = 'respond-helpful' | 'respond-not-helpful' | 'revoke-response';

const validateCommand = O.fromPredicate((command): command is ValidCommand => (
  command === 'respond-helpful' || command === 'revoke-response' || command === 'respond-not-helpful'
));

export const createRespondHandler = (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const { user } = context.state;
  const reviewId = toReviewId(context.request.body.reviewid);

  const command = context.request.body.command as string;
  const validatedCommand = validateCommand(command);

  await commandHandler(
    ports.commitEvents,
    ports.getAllEvents,
    pipe(
      validatedCommand,
      O.getOrElse<ValidCommand>(() => { throw new BadRequest(); }),
    ),
    user.id,
    reviewId,
  )();

  context.redirect('back');

  await next();
};
