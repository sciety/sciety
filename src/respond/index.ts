import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { BadRequest } from 'http-errors';
import {
  commandHandler, CommitEvents, validateCommand,
} from './command-handler';
import { GetAllEvents } from './respond-helpful-command';
import { toReviewId, toString } from '../types/review-id';
import { User } from '../types/user';

type Ports = {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};

export const respondHandler = (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const { user } = context.state;
  const reviewId = toReviewId(context.request.body.reviewid);

  const referrer = (context.request.headers.referer ?? '/') as string;
  await pipe(
    context.request.body.command,
    O.fromNullable,
    O.chain(validateCommand),
    O.fold(
      () => { throw new BadRequest(); },
      commandHandler(ports.commitEvents, ports.getAllEvents, user.id, reviewId),
    ),
  )();

  context.redirect(`${referrer}#${toString(reviewId)}`);

  await next();
};
