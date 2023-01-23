import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { GetUserViaHandle, SelectAllListsOwnedBy } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import * as LOID from '../../types/list-owner-id';
import { toErrorResponse } from '../page-handler';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';

type Ports = GetLoggedInScietyUserPorts & {
  getUserViaHandle: GetUserViaHandle,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

export const redirectUserListPageToGenericListPage = (adapters: Ports): Middleware => async (context) => {
  pipe(
    context.params.handle as string,
    adapters.getUserViaHandle,
    O.map((user) => user.id),
    O.map(LOID.fromUserId),
    O.map(adapters.selectAllListsOwnedBy),
    O.chain(RA.head),
    O.match(
      () => {
        const loggedInUser = getLoggedInScietyUser(adapters, context);
        const response = toErrorResponse(loggedInUser)({
          type: DE.notFound,
          message: toHtmlFragment('Sorry, we can\'t find this user or their list.'),
        });
        context.response.status = response.status;
        context.response.type = 'html';
        context.response.body = response.body;
      },
      (list) => {
        context.status = StatusCodes.PERMANENT_REDIRECT;
        context.redirect(`/lists/${list.id}`);
        return undefined;
      },
    ),
  );
};
