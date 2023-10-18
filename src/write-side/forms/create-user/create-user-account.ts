import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { StatusCodes } from 'http-status-codes';
import { getAuthenticatedUserIdFromContext, getLoggedInScietyUser, Ports as GetLoggedInScietyUserDependencies } from '../../../http/authentication-and-logging-in-of-sciety-users';
import { toWebPage } from '../../../http/page-handler';
import { redirectToAuthenticationDestination } from '../../../http/authentication-destination';
import { UserGeneratedInput } from '../../../types/user-generated-input';
import { ViewModel } from './create-user-account-form-page/view-model';
import { renderFormPage } from './create-user-account-form-page/create-user-account-form-page';
import { createUserAccountFormPageLayout } from './create-user-account-form-page/create-user-account-form-page-layout';
import {
  CreateUserAccountForm,
  constructValidationRecovery, createUserAccountFormCodec, formFieldsCodec, unvalidatedFormDetailsCodec,
} from './validation';
import { CreateUserAccountCommand } from '../../commands';
import { UserId } from '../../../types/user-id';
import { createUserAccountCommandHandler } from '../../command-handlers';
import { DependenciesForCommands } from '../../dependencies-for-commands';

const defaultSignUpAvatarUrl = '/static/images/profile-dark.svg';

const toCommand = (authenticatedUserId: UserId) => (input: CreateUserAccountForm): CreateUserAccountCommand => ({
  userId: authenticatedUserId,
  displayName: input.fullName,
  handle: input.handle,
  avatarUrl: defaultSignUpAvatarUrl,
});

 type Dependencies = DependenciesForCommands & GetLoggedInScietyUserDependencies;

export const createUserAccount = (dependencies: Dependencies): Middleware => async (context, next) => {
  const authenticatedUserId = getAuthenticatedUserIdFromContext(context);
  const formFields = formFieldsCodec.decode(context.request.body);
  const validatedFormFields = createUserAccountFormCodec.decode(context.request.body);

  if (O.isNone(authenticatedUserId)) {
    context.response.status = StatusCodes.UNAUTHORIZED;
    context.response.body = 'You must be authenticated to perform this action.';
    return;
  }

  if (E.isLeft(formFields)) {
    context.response.status = StatusCodes.BAD_REQUEST;
    context.response.body = 'Something went wrong when you submitted the form.';
    return;
  }

  if (E.isLeft(validatedFormFields)) {
    const page = pipe(
      context.request.body,
      unvalidatedFormDetailsCodec.decode,
      E.getOrElse(() => ({
        fullName: '' as UserGeneratedInput,
        handle: '' as UserGeneratedInput,
      })),
      (formDetails) => ({
        pageHeader: 'Sign up',
        errorSummary: O.some(''),
        handle: formDetails.handle,
        fullName: formDetails.fullName,
        validationRecovery: constructValidationRecovery(formFields.right),
      }) satisfies ViewModel,
      renderFormPage,
      E.right,
      toWebPage(getLoggedInScietyUser(dependencies, context), createUserAccountFormPageLayout),
    );
    context.response.status = page.status;
    context.response.type = 'html';
    context.response.body = page.body;
    return;
  }

  const commandResult = await pipe(
    validatedFormFields.right,
    toCommand(authenticatedUserId.value),
    createUserAccountCommandHandler(dependencies),
  )();

  if (E.isLeft(commandResult)) {
    context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
    context.response.body = 'Your input appears to be valid but we failed to handle it.';
    return;
  }

  redirectToAuthenticationDestination(context);
  await next();
};
