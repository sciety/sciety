import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe, flow } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import { sequenceS } from 'fp-ts/Apply';
import {
  AddArticleToList, Logger,
} from '../../shared-ports';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../../http/authentication-and-logging-in-of-sciety-users';
import { checkUserOwnsList, Ports as CheckUserOwnsListPorts } from '../../http/forms/check-user-owns-list';
import { listIdCodec } from '../../types/list-id';

export const articleIdFieldName = 'articleid';

type Ports = CheckUserOwnsListPorts & GetLoggedInScietyUserPorts & {
  addArticleToList: AddArticleToList,
  logger: Logger,
};

const contextCodec = t.type({
  request: t.type({
    body: t.strict({
      [articleIdFieldName]: DoiFromString,
      listId: listIdCodec,
    }),
  }),
});

export const saveArticleHandler = (dependencies: Ports): Middleware => async (context) => {
  const foo = pipe(
    {
      body: pipe(
        context,
        contextCodec.decode,
        E.map((ctx) => ctx.request.body),
        O.fromEither,
      ),
      userId: pipe(
        getLoggedInScietyUser(dependencies, context),
        O.map((userDetails) => userDetails.id),
      ),
    },
    sequenceS(O.Apply),
  );
  if (O.isNone(foo)) {
    dependencies.logger('error', 'saveArticleHandler codec failed or missing user', { requestBody: context.request.body });
    context.redirect('back');
    return;
  }

  await pipe(
    foo.value,
    ({ userId, body }) => pipe(
      {
        articleId: body[articleIdFieldName],
        listId: body.listId,
      },
      TE.of,
      TE.chainFirst(flow(
        (command) => checkUserOwnsList(dependencies, command.listId, userId),
        TE.mapLeft((logEntry) => {
          dependencies.logger('error', logEntry.message, logEntry.payload);
          return logEntry;
        }),
      )),
      TE.chainW(dependencies.addArticleToList),
      TE.getOrElseW((error) => {
        dependencies.logger('error', 'saveArticleHandler failed', { error });
        return T.of(error);
      }),
      T.map(() => undefined),
    ),
  )();

  context.redirect('back');
};
