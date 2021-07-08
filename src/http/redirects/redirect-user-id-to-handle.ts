import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import * as DE from '../../types/data-error';
import { UserId } from '../../types/user-id';

type Ports = {
  getUserDetails: (userID: UserId) => TE.TaskEither<DE.DataError, { handle: string }>,
};

export const redirectUserIdToHandle = (ports: Ports): Middleware => async (context, next) => {
  await pipe(
    ports.getUserDetails(context.params.id as UserId),
    T.map(E.fold(
      () => {
        context.status = StatusCodes.NOT_FOUND;
      },
      ({ handle }) => {
        context.status = StatusCodes.PERMANENT_REDIRECT;
        context.redirect(`/users/${handle}/saved-articles`);
      },
    )),
  )();

  await next();
};
