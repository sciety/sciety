import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import { checkUserOwnsList, Ports as CheckUserOwnsListPorts } from './check-user-owns-list';
import { decodeFormSubmissionAndHandleFailures } from './decode-form-submission-and-handle-failures';
import { Logger } from '../../shared-ports';
import { articleIdCodec } from '../../types/article-id';
import { listIdCodec } from '../../types/list-id';
import { UnsafeUserInput, unsafeUserInputCodec } from '../../types/unsafe-user-input';
import { addArticleToListCommandHandler } from '../../write-side/command-handlers';
import { AddArticleToListCommand } from '../../write-side/commands';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';
import { sendDefaultErrorHtmlResponse } from '../send-default-error-html-response';

export const articleIdFieldName = 'articleid';

type Ports = CheckUserOwnsListPorts & GetLoggedInScietyUserPorts & DependenciesForCommands & {
  logger: Logger,
};

const saveArticleHandlerFormBodyCodec = t.strict({
  [articleIdFieldName]: articleIdCodec,
  listId: listIdCodec,
  annotation: unsafeUserInputCodec,
}, 'saveArticleHandlerFormBodyCodec');

export const saveArticleHandler = (dependencies: Ports): Middleware => async (context) => {
  const loggedInUserId = pipe(
    getLoggedInScietyUser(dependencies, context),
    O.map((userDetails) => userDetails.id),
  );
  if (O.isNone(loggedInUserId)) {
    dependencies.logger('warn', 'Form submission attempted while not logged in', { requestPath: context.request.path });
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.FORBIDDEN, 'You must be logged in to save an article.');
    return;
  }

  const formBody = decodeFormSubmissionAndHandleFailures(
    dependencies,
    context,
    saveArticleHandlerFormBodyCodec,
    loggedInUserId.value,
  );
  if (E.isLeft(formBody)) {
    return;
  }

  const articleId = formBody.right[articleIdFieldName];
  const listId = formBody.right.listId;

  const logEntry = checkUserOwnsList(dependencies, listId, loggedInUserId.value);
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
