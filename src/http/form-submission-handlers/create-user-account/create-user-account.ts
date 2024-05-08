import { pipe } from 'fp-ts/function';
import { Middleware, ParameterizedContext } from 'koa';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import {
  Ports as GetLoggedInScietyUserPorts, getAuthenticatedUserIdFromContext, getLoggedInScietyUser,
} from '../../authentication-and-logging-in-of-sciety-users';
import { createUserAccountFormPageLayout, renderFormPage } from '../../../html-pages/create-user-account-form-page';
import { constructHtmlResponse } from '../../../html-pages/construct-html-response';
import { createUserAccountFormRawCodec } from './codecs';
import { redirectToAuthenticationDestination } from '../../authentication-destination';
import { sendHtmlResponse } from '../../send-html-response';
import { detectClientClassification } from '../../detect-client-classification';
import { createUserAccountCommandHandler } from '../../../write-side/command-handlers';
import { Logger } from '../../../shared-ports';
import { DependenciesForCommands } from '../../../write-side/dependencies-for-commands';
import { sendDefaultErrorHtmlResponse } from '../../send-default-error-html-response';
import { decodeAndLogFailures } from '../../../third-parties/decode-and-log-failures';
import { userHandleAlreadyExistsError } from '../../../write-side/resources/user/check-command';
import { ViewModel } from '../../../html-pages/create-user-account-form-page/view-model';
import { userHandleAlreadyExists } from './user-handle-already-exists';
import { validateUserEditableFields } from './validate-user-editable-fields';
import { toCommand } from './to-command';
import { containsErrors } from '../../../html-pages/validation-recovery/contains-errors';

type Dependencies = GetLoggedInScietyUserPorts & DependenciesForCommands & {
  logger: Logger,
};

const instantiateSendRecovery = (
  context: ParameterizedContext,
  dependencies: Dependencies,
) => (viewModel: ViewModel) => {
  const htmlResponse = pipe(
    viewModel,
    renderFormPage,
    E.right,
    constructHtmlResponse(
      getLoggedInScietyUser(dependencies, context),
      createUserAccountFormPageLayout,
      detectClientClassification(context),
    ),
  );
  sendHtmlResponse(context)(htmlResponse);
};

export const createUserAccount = (dependencies: Dependencies): Middleware => async (context, next) => {
  const sendRecovery = instantiateSendRecovery(context, dependencies);
  const authenticatedUserId = getAuthenticatedUserIdFromContext(context);
  const formFields = pipe(
    context.request.body,
    decodeAndLogFailures(dependencies.logger, createUserAccountFormRawCodec),
  );

  if (O.isNone(authenticatedUserId)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.UNAUTHORIZED, 'This step requires you do be logged in. Please try logging in again.');
    return;
  }

  if (E.isLeft(formFields)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.BAD_REQUEST, 'Something went wrong when you submitted the form. Please try again.');
    return;
  }

  const validationResult = validateUserEditableFields(formFields.right);

  if (containsErrors(validationResult)) {
    sendRecovery(O.some(validationResult));
    return;
  }

  const commandResult = await pipe(
    toCommand(formFields.right, authenticatedUserId.value),
    createUserAccountCommandHandler(dependencies),
  )();

  if (E.isLeft(commandResult) && commandResult.left === userHandleAlreadyExistsError) {
    sendRecovery(userHandleAlreadyExists(formFields.right));
    return;
  }

  if (E.isLeft(commandResult)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong on our end when we tried to create your Sciety account. Please try again later.');
    return;
  }

  redirectToAuthenticationDestination(context);

  await next();
};
