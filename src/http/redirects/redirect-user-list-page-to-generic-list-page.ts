import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { SelectAllListsOwnedBy } from '../../shared-ports';
import { GetTwitterUserId } from '../../third-parties/twitter';
import * as DE from '../../types/data-error';
import { toHtmlFragment } from '../../types/html-fragment';
import * as LOID from '../../types/list-owner-id';
import { toErrorResponse } from '../page-handler';

type Ports = {
  getUserId: GetTwitterUserId,
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

export const redirectUserListPageToGenericListPage = (adapters: Ports): Middleware => async (context) => {
  await pipe(
    context.params.handle as string,
    adapters.getUserId,
    TE.map(LOID.fromUserId),
    TE.map(adapters.selectAllListsOwnedBy),
    TE.chainEitherK(flow(
      RA.head,
      E.fromOption(() => 'User has no list'),
    )),
    TE.match(
      () => {
        const response = toErrorResponse(O.fromNullable(context.state.user))({
          type: DE.notFound,
          message: toHtmlFragment('Sorry, we can\'t find this user or their list.'),
        });
        context.response.status = response.status;
        context.response.type = 'html';
        context.response.body = response.body;
      },
      (list) => {
        context.status = StatusCodes.PERMANENT_REDIRECT;
        context.redirect(`/lists/${list.listId}`);
        return undefined;
      },
    ),
  )();
};
