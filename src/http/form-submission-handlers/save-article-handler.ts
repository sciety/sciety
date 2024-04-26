import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import { Middleware } from 'koa';
import { checkUserOwnsList, Ports as CheckUserOwnsListPorts } from './check-user-owns-list';
import { Logger } from '../../shared-ports';
import { articleIdCodec } from '../../types/article-id';
import { listIdCodec } from '../../types/list-id';
import { UnsafeUserInput, unsafeUserInputCodec } from '../../types/unsafe-user-input';
import { addArticleToListCommandHandler } from '../../write-side/command-handlers';
import { AddArticleToListCommand } from '../../write-side/commands';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from '../authentication-and-logging-in-of-sciety-users';

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
    dependencies.logger('error', 'Missing user', { requestBody: context.request.body });
    context.redirect('back');
    return;
  }
  const formBody = pipe(
    context.request.body,
    saveArticleHandlerFormBodyCodec.decode,
    E.mapLeft((errors) => {
      dependencies.logger('error', 'saveArticleHandlerFormBodyCodec failed', {
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
