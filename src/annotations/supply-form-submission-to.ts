import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import bodyParser from 'koa-bodyparser';
import compose from 'koa-compose';
import { sequenceS } from 'fp-ts/Apply';
import * as t from 'io-ts';
import { redirectBack } from '../http/redirect-back';
import { CommandResult } from '../types/command-result';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../http/authentication-and-logging-in-of-sciety-users';
import { htmlFragmentCodec } from '../types/html-fragment';
import { DoiFromString } from '../types/codecs/DoiFromString';
import * as LID from '../types/list-id';
import { Queries } from '../read-models';

type CommandHandler = (input: unknown) => TE.TaskEither<unknown, CommandResult>;

const bodyCodec = t.type({
  annotationContent: htmlFragmentCodec,
  articleId: DoiFromString,
  listId: LID.listIdCodec,
});

type Dependencies = Queries & GetLoggedInScietyUserPorts;

const requireUserToOwnTheList = (adapters: Dependencies): Middleware => async (context, next) => {
  pipe(
    {
      loggedInUser: getLoggedInScietyUser(adapters, context),
      listOwnerId: pipe(
        context.request.body,
        bodyCodec.decode,
        O.fromEither,
        O.map((body) => body.listId),
        O.map(LID.fromValidatedString),
        O.chain(adapters.lookupList),
        O.chainNullableK((list) => list.ownerId.value),
      ),
    },
    (foo) => foo,
    sequenceS(O.Apply),
    O.filter(({ loggedInUser, listOwnerId }) => loggedInUser.id === listOwnerId),
    O.match(
      () => {
        context.response.status = StatusCodes.FORBIDDEN;
        context.response.body = 'Only the list owner is allowed to annotate their list.';
      },
      async () => { await next(); },
    ),
  );
};

type SupplyFormSubmissionTo = (
  adapters: Dependencies,
  handler: CommandHandler,
) => Middleware;

export const supplyFormSubmissionTo: SupplyFormSubmissionTo = (adapters, handler) => compose([
  bodyParser({ enableTypes: ['form'] }),
  requireUserToOwnTheList(adapters),
  async (context, next) => {
    await pipe(
      context.request.body,
      handler,
    )();

    await next();
  },
  redirectBack,
]);
