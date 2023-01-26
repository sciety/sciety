import * as t from 'io-ts';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { GetUserViaHandle, SelectAllListsOwnedBy } from '../../shared-ports';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import * as LOID from '../../types/list-owner-id';
import { toErrorResponse } from '../page-handler';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';
import { userHandleCodec } from '../../types/user-handle';
import { UserDetails } from '../../types/user-details';

type Ports = GetLoggedInScietyUserPorts & {
  getUserViaHandle: GetUserViaHandle,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

const params = t.type({
  handle: userHandleCodec,
});

const toUserHandle = flow(
  params.decode,
  O.fromEither,
  O.map((p) => p.handle),
);

const toFirstOwnedList = (adapters: Ports) => (user: UserDetails) => pipe(
  user.id,
  LOID.fromUserId,
  adapters.selectAllListsOwnedBy,
  RA.head,
);

export const redirectUserListPageToGenericListPage = (adapters: Ports): Middleware => async (context) => {
  pipe(
    context.params,
    toUserHandle,
    O.chain(adapters.getUserViaHandle),
    O.chain(toFirstOwnedList(adapters)),
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
