import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import { checkUserOwnsList, Dependencies as CheckUserOwnsListDependencies } from './check-user-owns-list';
import { decodeFormSubmission, Dependencies as DecodeFormSubmissionDependencies } from './decode-form-submission';
import { ensureUserIsLoggedIn, Dependencies as EnsureUserIsLoggedInDependencies } from './ensure-user-is-logged-in';
import { Logger } from '../../shared-ports';
import { articleIdCodec } from '../../types/article-id';
import { listIdCodec } from '../../types/list-id';
import { UnsafeUserInput, unsafeUserInputCodec } from '../../types/unsafe-user-input';
import { addArticleToListCommandHandler } from '../../write-side/command-handlers';
import { AddArticleToListCommand } from '../../write-side/commands';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';

export const articleIdFieldName = 'articleid';

type Dependencies =
  CheckUserOwnsListDependencies &
  EnsureUserIsLoggedInDependencies &
  DependenciesForCommands &
  DecodeFormSubmissionDependencies &
  {
    logger: Logger,
  };

const saveArticleHandlerFormBodyCodec = t.strict({
  [articleIdFieldName]: articleIdCodec,
  listId: listIdCodec,
  annotation: unsafeUserInputCodec,
}, 'saveArticleHandlerFormBodyCodec');

export const saveArticleHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUser = ensureUserIsLoggedIn(dependencies, context, 'You must be logged in to save an article.');
  if (O.isNone(loggedInUser)) {
    return;
  }

  const formBody = decodeFormSubmission(
    dependencies,
    context,
    saveArticleHandlerFormBodyCodec,
    loggedInUser.value.id,
  );
  if (E.isLeft(formBody)) {
    return;
  }

  const articleId = formBody.right[articleIdFieldName];
  const listId = formBody.right.listId;

  const logEntry = checkUserOwnsList(dependencies, listId, loggedInUser.value.id);
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
