import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import { Middleware } from 'koa';
import { decodeFormSubmission, Dependencies as DecodeFormSubmissionDependencies } from './decode-form-submission';
import { ensureUserIsLoggedIn, Dependencies as EnsureUserIsLoggedInDependencies } from './ensure-user-is-logged-in';
import { Queries } from '../../read-models';
import { UserId } from '../../types/user-id';
import { DependenciesForCommands } from '../../write-side';
import { RemoveListPromotionCommand, removeListPromotionCommandCodec } from '../../write-side/commands';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import * as listPromotion from '../../write-side/resources/list-promotion';
import { sendDefaultErrorHtmlResponse } from '../send-default-error-html-response';

const formBodyCodec = t.intersection([
  removeListPromotionCommandCodec,
  t.strict({
    successRedirectPath: tt.NonEmptyString,
  }),
]);

type FormBody = t.TypeOf<typeof formBodyCodec>;

const toCommand = (formBody: FormBody) => ({
  forGroup: formBody.forGroup,
  listId: formBody.listId,
});

type Dependencies = EnsureUserIsLoggedInDependencies
& Queries
& DecodeFormSubmissionDependencies & DependenciesForCommands;

const isAuthorised = (
  dependencies: Dependencies, loggedInUser: UserId, command: RemoveListPromotionCommand,
) => dependencies.isUserAdminOfGroup(loggedInUser, command.forGroup);

export const removeListPromotionHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUserId = ensureUserIsLoggedIn(dependencies, context, 'You must be logged in to feature a list.');
  if (O.isNone(loggedInUserId)) {
    return;
  }
  const formBody = decodeFormSubmission(
    dependencies,
    context,
    formBodyCodec,
    loggedInUserId.value,
  );
  if (E.isLeft(formBody)) {
    return;
  }

  const command = toCommand(formBody.right);

  if (!isAuthorised(dependencies, loggedInUserId.value, command)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.FORBIDDEN, 'You do not have permission to do that.');
    return;
  }

  const commandResult = await pipe(
    command,
    executeResourceAction(dependencies, listPromotion.remove),
  )();

  if (E.isRight(commandResult)) {
    context.redirect(formBody.right.successRedirectPath);
    return;
  }
  sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.INTERNAL_SERVER_ERROR, 'An unexpected error occurred.');
};
