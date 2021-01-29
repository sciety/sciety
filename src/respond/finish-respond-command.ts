import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import {
  commandHandler, CommitEvents, GetAllEvents, validateCommand,
} from './command-handler';
import { toReviewId } from '../types/review-id';

type Ports = {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};

export const finishRespondCommand = (ports: Ports): Middleware => async (context, next) => {
  const userId = context.state.user.id;
  await pipe(
    // TODO: move userId, reviewId, command into a new type that gets constructed by a validator
    context.session.command,
    O.fromNullable,
    O.chain(validateCommand),
    O.fold(
      () => T.of(undefined),
      flow(
        (validatedCommand) => commandHandler(
          ports.commitEvents,
          ports.getAllEvents,
          userId,
          toReviewId(context.session.reviewId),
        )(validatedCommand),
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
