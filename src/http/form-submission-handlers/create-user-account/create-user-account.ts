import { pipe } from 'fp-ts/function';
import { Middleware, ParameterizedContext } from 'koa';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import * as t from 'io-ts';
import {
  Ports as GetLoggedInScietyUserPorts, getAuthenticatedUserIdFromContext, getLoggedInScietyUser,
} from '../../authentication-and-logging-in-of-sciety-users';
import { createUserAccountFormPageLayout, renderFormPage } from '../../../html-pages/create-user-account-form-page';
import { constructHtmlResponse } from '../../../html-pages/construct-html-response';
import { createUserAccountFormCodec } from './codecs';
import { redirectToAuthenticationDestination } from '../../authentication-destination';
import { sendHtmlResponse } from '../../send-html-response';
import { detectClientClassification } from '../../detect-client-classification';
import { createUserAccountCommandHandler } from '../../../write-side/command-handlers';
import { Logger } from '../../../shared-ports';
import { DependenciesForCommands } from '../../../write-side/dependencies-for-commands';
import { sendDefaultErrorHtmlResponse } from '../../send-default-error-html-response';
import { toFieldsCodec } from '../to-fields-codec';
import { decodeAndLogFailures } from '../../../third-parties/decode-and-log-failures';
import { rawUserInput } from '../../../read-side';
import { userHandleAlreadyExistsError } from '../../../write-side/resources/user/check-command';
import { Recovery } from '../../../html-pages/create-user-account-form-page/recovery';
import { CreateUserAccountCommand } from '../../../write-side/commands';

const createUserAccountFormFieldsCodec = toFieldsCodec(createUserAccountFormCodec.props, 'createUserAccountFormFieldsCodec');

const constructValidationRecovery = (formInputs: t.TypeOf<typeof createUserAccountFormFieldsCodec>) => O.some({
  fullName: { userInput: rawUserInput(formInputs.fullName), error: O.none },
  handle: { userInput: rawUserInput(formInputs.handle), error: O.none },
});

const userHandleAlreadyExistsRecovery = (formInputs: t.TypeOf<typeof createUserAccountFormFieldsCodec>) => O.some({
  fullName: { userInput: rawUserInput(formInputs.fullName), error: O.none },
  handle: { userInput: rawUserInput(formInputs.handle), error: O.some('This handle is already taken. Please try a different one.') },
});

const defaultSignUpAvatarUrl = '/static/images/profile-dark.svg';

const toCommand = (inputs: t.TypeOf<typeof createUserAccountFormCodec>, userId: CreateUserAccountCommand['userId']) => (
  {
    handle: inputs.handle,
    displayName: inputs.fullName,
    userId,
    avatarUrl: defaultSignUpAvatarUrl,
  });

type Dependencies = GetLoggedInScietyUserPorts & DependenciesForCommands & {
  logger: Logger,
};

const instantiateSendRecovery = (context: ParameterizedContext, dependencies: Dependencies) => (recovery: Recovery) => {
  const htmlResponse = pipe(
    recovery,
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
    decodeAndLogFailures(dependencies.logger, createUserAccountFormFieldsCodec),
  );
  const validatedFormFields = pipe(
    context.request.body,
    decodeAndLogFailures(dependencies.logger, createUserAccountFormCodec),
  );

  if (O.isNone(authenticatedUserId)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.UNAUTHORIZED, 'This step requires you do be logged in. Please try logging in again.');
    return;
  }

  if (E.isLeft(formFields)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.BAD_REQUEST, 'Something went wrong when you submitted the form. Please try again.');
    return;
  }

  if (E.isLeft(validatedFormFields)) {
    sendRecovery(constructValidationRecovery(formFields.right));
    return;
  }

  const commandResult = await pipe(
    toCommand(validatedFormFields.right, authenticatedUserId.value),
    createUserAccountCommandHandler(dependencies),
  )();

  if (E.isLeft(commandResult) && commandResult.left === userHandleAlreadyExistsError) {
    sendRecovery(userHandleAlreadyExistsRecovery(formFields.right));
    return;
  }

  if (E.isLeft(commandResult)) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong on our end when we tried to create your Sciety account. Please try again later.');
    return;
  }

  redirectToAuthenticationDestination(context);

  await next();
};
