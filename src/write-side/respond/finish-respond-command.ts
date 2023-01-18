import { sequenceS } from 'fp-ts/Apply';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../../http/authentication-and-logging-in-of-sciety-users';
import {
  commandHandler, CommitEvents, GetAllEvents, toCommand,
} from './command-handler';
import { reviewIdCodec } from '../../types/review-id';

type Ports = GetLoggedInScietyUserPorts & {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};

export const finishRespondCommand = (ports: Ports): Middleware => async (context, next) => {
  await pipe(
    // TODO: move userId, reviewId, command into a new type that gets constructed by a validator
    {
      reviewId: pipe(context.session.reviewId, reviewIdCodec.decode, O.fromEither),
      command: pipe(context.session.command, toCommand),
      userId: pipe(
        getLoggedInScietyUser(ports, context),
        O.map((user) => user.id),
      ),
    },
    sequenceS(O.Apply),
    O.fold(
      () => T.of(undefined),
      ({ reviewId, command, userId }) => pipe(
        {
          reviewId,
          command,
        },
        commandHandler(
          ports.commitEvents,
          ports.getAllEvents,
          userId,
        ),
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
