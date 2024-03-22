import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import * as PR from 'io-ts/PathReporter';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../../shared-ports';
import { articleIdCodec } from '../../types/article-id';
import { getAuthenticatedUserIdFromContext, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';
import { checkUserOwnsList, Ports as CheckUserOwnsListPorts } from './check-user-owns-list';
import { listIdCodec } from '../../types/list-id';
import { AddArticleToListCommand } from '../../write-side/commands';
import { addArticleToListCommandHandler } from '../../write-side/command-handlers';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { UnsafeUserInput, unsafeUserInputCodec } from '../../types/unsafe-user-input';
import { sendDefaultErrorHtmlResponse } from '../send-default-error-html-response';

export const articleIdFieldName = 'articleid';

type Ports = CheckUserOwnsListPorts & GetLoggedInScietyUserPorts & DependenciesForCommands & {
  logger: Logger,
};

const formBodyCodec = t.strict({
  [articleIdFieldName]: articleIdCodec,
  listId: listIdCodec,
  annotation: unsafeUserInputCodec,
});

export const saveArticleHandler = (dependencies: Ports): Middleware => async (context) => {
  const authenticatedUserId = getAuthenticatedUserIdFromContext(context);
  if (O.isNone(authenticatedUserId)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.UNAUTHORIZED, 'This step requires you do be logged in. Please try logging in again.');
    return;
  }
  const formBody = pipe(
    context.request.body,
    formBodyCodec.decode,
    E.mapLeft((errors) => {
      dependencies.logger('error', 'saveArticleHandler codec failed', {
        requestBody: context.request.body,
        errors: PR.failure(errors),
      });
    }),
  );
  if (E.isLeft(formBody)) {
    context.redirect('back');
    return;
  }

  const articleId = formBody.right[articleIdFieldName];
  const listId = formBody.right.listId;

  const logEntry = checkUserOwnsList(dependencies, listId, authenticatedUserId.value);
  if (E.isLeft(logEntry)) {
    dependencies.logger('error', logEntry.left.message, logEntry.left.payload);
    dependencies.logger('error', 'saveArticleHandler failed', { error: logEntry.left });
    context.redirect(`/articles/${articleId.value}`);
    return;
  }

  const fromFormInputToOptionalProperty = (value: UnsafeUserInput) => (
    value.length === 0 ? undefined : value
  );

  const command: AddArticleToListCommand = {
    articleId,
    listId,
    annotation: fromFormInputToOptionalProperty(formBody.right.annotation),
  };

  await pipe(
    command,
    addArticleToListCommandHandler(dependencies),
    TE.getOrElseW((error) => {
      dependencies.logger('error', 'saveArticleHandler failed', { error });
      return T.of(error);
    }),
    T.map(() => undefined),
  )();

  context.redirect(`/lists/${listId}`);
};
