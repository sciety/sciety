import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe, flow } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import { sequenceS } from 'fp-ts/Apply';
import { AddArticleToListCommand } from '../commands/add-article-to-list';
import {
  AddArticleToList, GetList, Logger, SelectAllListsOwnedBy,
} from '../../shared-ports';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import * as Doi from '../../types/doi';
import { ErrorMessage, toErrorMessage } from '../../types/error-message';
import * as LOID from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../../http/authentication-and-logging-in-of-sciety-users';
import { checkUserOwnsList } from '../../http/forms/check-user-owns-list';

export const articleIdFieldName = 'articleid';

type Ports = GetLoggedInScietyUserPorts & {
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
  addArticleToList: AddArticleToList,
  logger: Logger,
  getList: GetList,
};

type ConstructCommand = (
  ports: Ports,
  userId: UserId,
  articleId: Doi.Doi,
) => TE.TaskEither<ErrorMessage, AddArticleToListCommand>;

const constructCommand: ConstructCommand = (
  ports,
  userId,
  articleId,
) => pipe(
  userId,
  LOID.fromUserId,
  ports.selectAllListsOwnedBy,
  RA.head,
  TE.fromOption(() => toErrorMessage('saveArticleHandler: Cannot find list for user')),
  TE.map((list) => ({ articleId, listId: list.id })),
);

const contextCodec = t.type({
  request: t.type({
    body: t.type({
      [articleIdFieldName]: DoiFromString,
    }),
  }),
});

export const saveArticleHandler = (ports: Ports): Middleware => async (context, next) => {
  await pipe(
    {
      articleId: pipe(
        context,
        contextCodec.decode,
        E.map((ctx) => ctx.request.body[articleIdFieldName]),
        O.fromEither,
      ),
      userId: pipe(
        getLoggedInScietyUser(ports, context),
        O.map((userDetails) => userDetails.id),
      ),
    },
    sequenceS(O.Apply),
    O.fold(
      () => T.of(undefined),
      ({ articleId, userId }) => pipe(
        constructCommand(ports, userId, articleId),
        TE.chainFirstW(flow(
          (command) => checkUserOwnsList(ports, command.listId, userId),
          TE.mapLeft((logEntry) => {
            ports.logger('error', logEntry.message, logEntry.payload);
            return logEntry;
          }),
        )),
        TE.chainW(ports.addArticleToList),
        TE.getOrElseW((error) => {
          ports.logger('error', 'saveArticleHandler failed', { error });
          return T.of(error);
        }),
        T.map(() => undefined),
      ),
    ),
  )();

  await next();
};
