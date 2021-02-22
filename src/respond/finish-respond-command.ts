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
    O.Do,
    O.bind('reviewId', () => O.tryCatch(() => pipe(context.session.reviewId, toReviewId))),
    O.bind('command', () => pipe(context.session.command, validateCommand)),
    O.fold(
      () => T.of(undefined),
      flow(
        commandHandler(
          ports.commitEvents,
          ports.getAllEvents,
          userId,
        ),
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
