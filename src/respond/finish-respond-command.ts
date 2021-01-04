import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { flow, pipe } from 'fp-ts/lib/function';
import { Middleware } from 'koa';
import {
  commandHandler, CommitEvents, GetAllEvents, validateCommand,
} from './command-handler';
import toReviewId from '../types/review-id';

type Ports = {
  commitEvents: CommitEvents;
  getAllEvents: GetAllEvents;
};

export const finishRespondCommand = (ports: Ports): Middleware => async (context, next) => {
  const userId = context.state.user.id;
  const reviewId = toReviewId(context.session.reviewId);
  await pipe(
    context.session.command,
    O.fromNullable,
    O.chain(validateCommand),
    O.fold(
      () => T.of(undefined),
      flow(
        commandHandler(ports.commitEvents, ports.getAllEvents, userId, reviewId),
        T.map((task) => {
          delete context.session.command;
          delete context.session.reviewId;
          return task;
        }),
      ),
    ),
  )();

  await next();
};
