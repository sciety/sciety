import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { GetUser } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import { UserId } from '../../types/user-id';
import { toErrorResponse } from '../page-handler';
import { getLoggedInScietyUser } from '../get-logged-in-sciety-user';

type Ports = {
  getUser: GetUser,
};

export const redirectUserIdToHandle = (ports: Ports, path: string): Middleware => async (context, next) => {
  pipe(
    ports.getUser(context.params.id as UserId),
    O.fold(
      () => {
        const loggedInUser = getLoggedInScietyUser(ports, context);
        const response = toErrorResponse(loggedInUser)({
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
    ),
  );

  await next();
};
