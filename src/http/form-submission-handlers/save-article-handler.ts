import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import { Middleware } from 'koa';
import { checkUserOwnsList, Dependencies as CheckUserOwnsListDependencies } from './check-user-owns-list';
import { decodeFormSubmission, Dependencies as DecodeFormSubmissionDependencies } from './decode-form-submission';
import { ensureUserIsLoggedIn, Dependencies as EnsureUserIsLoggedInDependencies } from './ensure-user-is-logged-in';
import { Logger } from '../../logger';
import { inputFieldNames } from '../../standards';
import { articleIdCodec } from '../../types/article-id';
import { listIdCodec } from '../../types/list-id';
import { UnsafeUserInput, unsafeUserInputCodec } from '../../types/unsafe-user-input';
import { UserId } from '../../types/user-id';
import { DependenciesForCommands } from '../../write-side';
import { AddArticleToListCommand } from '../../write-side/commands';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import * as list from '../../write-side/resources/list';
import { sendDefaultErrorHtmlResponse } from '../send-default-error-html-response';

type Dependencies =
  CheckUserOwnsListDependencies &
  EnsureUserIsLoggedInDependencies &
  DependenciesForCommands &
  DecodeFormSubmissionDependencies &
  {
    logger: Logger,
  };

const isAuthorised = (
  dependencies: Dependencies, loggedInUser: UserId, command: AddArticleToListCommand,
) => {
  const result = checkUserOwnsList(dependencies, command.listId, loggedInUser);
  if (E.isLeft(result)) {
    dependencies.logger('error', result.left.message, result.left.payload);
    dependencies.logger('error', 'saveArticleHandler failed', { error: result.left });
    return false;
  }
  return true;
};

const saveArticleHandlerFormBodyCodec = t.strict({
  [inputFieldNames.articleId]: articleIdCodec,
  [inputFieldNames.listId]: listIdCodec,
  annotation: unsafeUserInputCodec,
}, 'saveArticleHandlerFormBodyCodec');

type FormBody = t.TypeOf<typeof saveArticleHandlerFormBodyCodec>;

const fromFormInputToOptionalProperty = (value: UnsafeUserInput) => (
  value.length === 0 ? undefined : value
);
const toCommand = (formBody: FormBody) => ({
  articleId: formBody[inputFieldNames.articleId],
  listId: formBody[inputFieldNames.listId],
  annotation: fromFormInputToOptionalProperty(formBody.annotation),
});

export const saveArticleHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUserId = ensureUserIsLoggedIn(dependencies, context, 'You must be logged in to save an article.');
  if (O.isNone(loggedInUserId)) {
    return;
  }

  const formBody = decodeFormSubmission(
    dependencies,
    context,
    saveArticleHandlerFormBodyCodec,
    loggedInUserId.value,
  );
  if (E.isLeft(formBody)) {
    return;
  }

  const listId = formBody.right[inputFieldNames.listId];

  const command: AddArticleToListCommand = toCommand(formBody.right);

  if (!isAuthorised(dependencies, loggedInUserId.value, command)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.FORBIDDEN, 'You do not have permission to do that.');
    return;
  }

  const commandResult = await pipe(
    command,
    executeResourceAction(dependencies, list.addArticle),
  )();

  if (E.isRight(commandResult)) {
    context.redirect(`/lists/${listId}`);
    return;
  }
  sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.INTERNAL_SERVER_ERROR, 'An unexpected error occurred.');
};
