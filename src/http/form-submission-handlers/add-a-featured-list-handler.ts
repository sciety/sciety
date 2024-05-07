import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import * as tt from 'io-ts-types';
import * as jsonwebtoken from 'jsonwebtoken';
import { Middleware } from 'koa';
import { decodeFormSubmission, Dependencies as DecodeFormSubmissionDependencies } from './decode-form-submission';
import { ensureUserIsLoggedIn, Dependencies as EnsureUserIsLoggedInDependencies } from './ensure-user-is-logged-in';
import { promoteListCommandCodec } from '../../write-side/commands';
import { DependenciesForCommands } from '../../write-side/dependencies-for-commands';
import { executeResourceAction } from '../../write-side/resources/execute-resource-action';
import * as listPromotion from '../../write-side/resources/list-promotion';
import { sendDefaultErrorHtmlResponse } from '../send-default-error-html-response';

const formBodyCodec = t.intersection([
  promoteListCommandCodec,
  t.strict({
    successRedirectPath: tt.NonEmptyString,
    authorizationToken: tt.NonEmptyString,
  }),
]);

const authorizationTokenCodec = t.strict({
  command: tt.NonEmptyString,
  parameters: t.record(t.string, t.string),
});

type Dependencies = EnsureUserIsLoggedInDependencies
& DecodeFormSubmissionDependencies & DependenciesForCommands;

export const addAFeaturedListHandler = (dependencies: Dependencies): Middleware => async (context) => {
  const loggedInUser = ensureUserIsLoggedIn(dependencies, context, 'You must be logged in to feature a list.');
  if (O.isNone(loggedInUser)) {
    return;
  }
  const formBody = decodeFormSubmission(
    dependencies,
    context,
    formBodyCodec,
    loggedInUser.value.id,
  );
  if (E.isLeft(formBody)) {
    return;
  }
  try {
    const token = jsonwebtoken.verify(formBody.right.authorizationToken, process.env.APP_SECRET ?? 'a-secret', { complete: true });
    // now check decoded contains the right authorization
    const decoded = authorizationTokenCodec.decode(token.payload);
    if (E.isLeft(decoded)) {
      sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.BAD_REQUEST, 'Authorization token cannot be understood.');
      return;
    }
    if (!(decoded.right.command === 'list-promotion.create' && decoded.right.parameters.groupId === formBody.right.forGroup)) {
      dependencies.logger('warn', 'Authorization check in a form handler failed', { authorizationTokenPayload: decoded.right, formBody: formBody.right });
      sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.FORBIDDEN, 'You do not have permission to do that.');
      return;
    }
  } catch (error) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.BAD_REQUEST, 'Authorization token failed verification.');
    return;
  }

  const command = {
    forGroup: formBody.right.forGroup,
    listId: formBody.right.listId,
  };

  const commandResult = await pipe(
    command,
    executeResourceAction(dependencies, listPromotion.create),
  )();

  if (E.isRight(commandResult)) {
    context.redirect(formBody.right.successRedirectPath);
    return;
  }
  sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.INTERNAL_SERVER_ERROR, 'An unexpected error occurred.');
};
