import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { Payload } from '../../infrastructure/logger';
import { Logger } from '../../shared-ports';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';

type Ports = GetLoggedInScietyUserPorts & {
  logger: Logger,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createListHandler = (adapters: Ports): Middleware => async (context) => {
  await pipe(
    getLoggedInScietyUser(adapters, context),
    O.map((userDetails) => userDetails.id),
    E.fromOption(() => ({
      message: 'Logged in user not found',
      payload: { context },
      errorType: 'codec-failed' as const,
    })),
    TE.fromEither,
    TE.match(
      (error: { errorType?: string, message: string, payload: Payload }) => {
        adapters.logger('error', error.message, error.payload);
        context.redirect('back');
      },
      () => {
        context.redirect('back');
      },
    ),
  )();
};
