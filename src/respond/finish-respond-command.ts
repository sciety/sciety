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
  await pipe(
    context.session.command,
    O.fromNullable,
    O.chain(validateCommand),
    O.fold(
      () => T.of(undefined),
      flow(
        (command2) => (
          commandHandler(
            ports.commitEvents,
            ports.getAllEvents,
            command2,
            context.state.user.id,
            toReviewId(context.session.reviewId),
          )),
        T.map((task) => {
          delete context.session.command;
          delete context.session.editorialCommunityId;
          return task;
        }),
      ),
    ),
  )();

  await next();
};
