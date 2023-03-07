import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import * as T from 'fp-ts/Task';
import { commandCodec, commandHandler } from './command-handler';
import * as RI from '../../types/review-id';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../../http/authentication-and-logging-in-of-sciety-users';
import { CommitEvents, GetAllEvents } from '../../shared-ports';

// ts-unused-exports:disable-next-line
export type Ports = GetLoggedInScietyUserPorts & {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};

const bodyCodec = t.type({
  reviewid: RI.reviewIdCodec,
  command: commandCodec,
});

export const respondHandler = (ports: Ports): Middleware => async (context, next) => {
  const referrer = (context.request.headers.referer ?? '/') as string;
  const reviewIdFromBody = await pipe(
    context.request.body,
    bodyCodec.decode,
    O.fromEither,
    O.chain((body) => pipe(
      getLoggedInScietyUser(ports, context),
      O.map((userDetails) => userDetails.id),
      O.map((userId) => ({
        reviewId: body.reviewid,
        command: body.command,
        userId,
      })),
    )),
    O.fold(
      () => context.throw(StatusCodes.BAD_REQUEST),
      ({ reviewId, command, userId }) => pipe(
        { reviewId, command },
        commandHandler(ports.commitEvents, ports.getAllEvents, userId),
        T.map(() => reviewId),
      ),
    ),
  )();

  context.redirect(`${referrer}#${reviewIdFromBody}`);

  await next();
};
