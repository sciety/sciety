import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { GetUserDetails } from '../../shared-ports/get-user-details';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';
import { toErrorResponse } from '../page-handler';

type Ports = {
  getUserDetails: GetUserDetails,
};

export const redirectUserIdToHandle = (ports: Ports, path: string): Middleware => async (context, next) => {
  await pipe(
    ports.getUserDetails(context.params.id as UserId),
    T.map(E.fold(
      () => {
        const response = toErrorResponse(O.fromNullable(context.state.user))({
          type: DE.notFound,
          message: toHtmlFragment('Sorry, we can\'t find this user.'),
        });
        context.response.status = response.status;
        context.response.type = 'html';
        context.response.body = response.body;
      },
      ({ handle }) => {
        context.status = StatusCodes.PERMANENT_REDIRECT;
        context.redirect(`/users/${handle}/${path}`);
      },
    )),
  )();

  await next();
};
