import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import { getAuthenticatedUserIdFromContext, getLoggedInScietyUser, Ports as GetLoggedInScietyUserDependencies } from '../../../http/authentication-and-logging-in-of-sciety-users';
import { redirectToAuthenticationDestination } from '../../../http/authentication-destination';
import { renderFormPage } from './create-user-account-form-page/render-form-page';
import { createUserAccountFormPageLayout } from './create-user-account-form-page/create-user-account-form-page-layout';
import {
  CreateUserAccountForm,
  constructValidationRecovery, createUserAccountFormCodec, formFieldsCodec,
} from './validation';
import { CreateUserAccountCommand } from '../../commands';
import { UserId } from '../../../types/user-id';
import { createUserAccountCommandHandler } from '../../command-handlers';
import { DependenciesForCommands } from '../../dependencies-for-commands';
import { userHandleAlreadyExistsError } from '../../resources/user/check-command';
import { sendErrorResponse } from './send-error-response';
import { ViewModel } from './create-user-account-form-page/view-model';

const defaultSignUpAvatarUrl = '/static/images/profile-dark.svg';

const toCommand = (authenticatedUserId: UserId) => (input: CreateUserAccountForm): CreateUserAccountCommand => ({
  userId: authenticatedUserId,
  displayName: input.fullName,
  handle: input.handle,
  avatarUrl: defaultSignUpAvatarUrl,
});

 type Dependencies = DependenciesForCommands & GetLoggedInScietyUserDependencies;

export const createUserAccount = (dependencies: Dependencies): Middleware => async (context, next) => {
  const sendRecovery = (
    viewModel: ViewModel,
  ) => {
    context.response.status = StatusCodes.BAD_REQUEST;
    context.response.type = 'html';
    context.response.body = pipe(
      viewModel,
      renderFormPage,
      createUserAccountFormPageLayout(getLoggedInScietyUser(dependencies, context)),
    );
  };

  const authenticatedUserId = getAuthenticatedUserIdFromContext(context);
  const formFields = formFieldsCodec.decode(context.request.body);
  const validatedFormFields = createUserAccountFormCodec.decode(context.request.body);

  if (O.isNone(authenticatedUserId)) {
    sendErrorResponse(context, StatusCodes.UNAUTHORIZED, 'You must be authenticated to perform this action.');
    return;
  }

  if (E.isLeft(formFields)) {
    sendErrorResponse(context, StatusCodes.BAD_REQUEST, 'Something went wrong when you submitted the form.');
    return;
  }

  if (E.isLeft(validatedFormFields)) {
    sendRecovery(constructValidationRecovery(formFields.right));
    return;
  }

  const commandResult = await pipe(
    validatedFormFields.right,
    toCommand(authenticatedUserId.value),
    createUserAccountCommandHandler(dependencies),
  )();

  if (E.isLeft(commandResult) && commandResult.left === userHandleAlreadyExistsError) {
    sendRecovery(O.some({
      fullName: { userInput: formFields.right.fullName, error: O.none },
      handle: { userInput: formFields.right.handle, error: O.some('The handle is already taken') },
    }));
    return;
  }

  if (E.isLeft(commandResult)) {
    sendErrorResponse(context, StatusCodes.INTERNAL_SERVER_ERROR, `Your input appears to be valid but we failed to handle it. ${commandResult.left}`);
    return;
  }

  redirectToAuthenticationDestination(context);
  await next();
};
