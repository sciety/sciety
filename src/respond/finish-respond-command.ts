import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import {
  commandHandler, GetAllEvents, toCommand,
} from './command-handler';
import { RuntimeGeneratedEvent } from '../domain-events/runtime-generated-event';
import { reviewIdCodec } from '../types/review-id';

type CommitEvents = (events: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

type Ports = {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};

export const finishRespondCommand = (ports: Ports): Middleware => async (context, next) => {
  const { user } = context.state;
  await pipe(
    // TODO: move userId, reviewId, command into a new type that gets constructed by a validator
    O.Do,
    O.apS('reviewId', pipe(context.session.reviewId, reviewIdCodec.decode, O.fromEither)),
    O.apS('command', pipe(context.session.command, toCommand)),
    O.fold(
      () => T.of(undefined),
      flow(
        (command) => commandHandler(ports)(user, command),
        T.chain(ports.commitEvents),
        T.map(() => {
          delete context.session.command;
          delete context.session.reviewId;
          return undefined;
        }),
      ),
    ),
  )();

  await next();
};
