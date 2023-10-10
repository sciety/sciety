import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import { sequenceS } from 'fp-ts/Apply';
import { AddArticleToList, Logger } from '../../shared-ports';
import { DoiFromString } from '../../types/codecs/DoiFromString';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../../http/authentication-and-logging-in-of-sciety-users';
import { checkUserOwnsList, Ports as CheckUserOwnsListPorts } from '../../http/forms/check-user-owns-list';
import { listIdCodec } from '../../types/list-id';
import { userGeneratedInputCodec } from '../../types/user-generated-input';

export const articleIdFieldName = 'articleid';

type Ports = CheckUserOwnsListPorts & GetLoggedInScietyUserPorts & {
  addArticleToList: AddArticleToList,
  logger: Logger,
};

const contextCodec = t.type({
  request: t.type({
    body: t.intersection([
      t.strict({
        [articleIdFieldName]: DoiFromString,
        listId: listIdCodec,
      }),
      t.partial({
        annotation: userGeneratedInputCodec({ maxInputLength: 4000, allowEmptyInput: true }),
      }),
    ]),
  }),
});

export const saveArticleHandler = (dependencies: Ports): Middleware => async (context) => {
  const params = pipe(
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
  if (O.isNone(params)) {
    dependencies.logger('error', 'saveArticleHandler codec failed or missing user', { requestBody: context.request.body });
    context.redirect('back');
    return;
  }

  const articleId = params.value.body[articleIdFieldName];
  const listId = params.value.body.listId;

  const logEntry = checkUserOwnsList(dependencies, listId, params.value.userId);
  if (E.isLeft(logEntry)) {
    dependencies.logger('error', logEntry.left.message, logEntry.left.payload);
    dependencies.logger('error', 'saveArticleHandler failed', { error: logEntry.left });
    context.redirect(`/articles/${articleId.value}`);
    return;
  }

  await pipe(
    {
      articleId,
      listId,
      annotation: params.value.body.annotation,
    },
    dependencies.addArticleToList,
    TE.getOrElseW((error) => {
      dependencies.logger('error', 'saveArticleHandler failed', { error });
      return T.of(error);
    }),
    T.map(() => undefined),
  )();

  context.redirect(`/lists/${listId}`);
};
