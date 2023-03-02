import { Middleware } from '@koa/router';
import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { commandHandler, toCommand } from './command-handler';
import * as RI from '../../types/review-id';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../../http/authentication-and-logging-in-of-sciety-users';
import { CommitEvents, GetAllEvents } from '../../shared-ports';

// ts-unused-exports:disable-next-line
export type Ports = GetLoggedInScietyUserPorts & {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};

export const respondHandler = (ports: Ports): Middleware => async (context, next) => {
  const referrer = (context.request.headers.referer ?? '/') as string;
  await pipe(
    {
      reviewId: pipe(context.request.body.reviewid, RI.deserialize),
      command: pipe(context.request.body.command, toCommand),
      userId: pipe(
        getLoggedInScietyUser(ports, context),
        O.map((userDetails) => userDetails.id),
      ),
    },
    sequenceS(O.Apply),
    O.fold(
      () => context.throw(StatusCodes.BAD_REQUEST),
      ({ reviewId, command, userId }) => pipe(
        { reviewId, command },
        commandHandler(ports.commitEvents, ports.getAllEvents, userId),
      ),
    ),
  )();

  context.redirect(`${referrer}#${String(context.request.body.reviewid)}`);

  await next();
};
