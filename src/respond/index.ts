import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { commandHandler, toCommand } from './command-handler';
import { GetAllEvents } from './respond-helpful-command';
import { RuntimeGeneratedEvent } from '../domain-events/runtime-generated-event';
import * as RI from '../types/review-id';
import { User } from '../types/user';

type CommitEvents = (events: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

type Ports = {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};

export const respondHandler = (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  const { user } = context.state;

  const referrer = (context.request.headers.referer ?? '/') as string;
  await pipe(
    O.Do,
    O.apS('reviewId', pipe(context.request.body.reviewid, RI.deserialize)),
    O.apS('command', pipe(context.request.body.command, toCommand)),
    O.fold(
      () => context.throw(StatusCodes.BAD_REQUEST),
      flow(
        commandHandler(ports.getAllEvents, user.id),
        T.chain(ports.commitEvents),
      ),
    ),
  )();

  context.redirect(`${referrer}#${String(context.request.body.reviewid)}`); // TODO needs moving somewhere else

  await next();
};
