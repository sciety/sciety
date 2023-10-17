import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as tt from 'io-ts-types';
import * as t from 'io-ts';
import { StatusCodes } from 'http-status-codes';
import {
  Ports as GetLoggedInScietyUserPorts, getLoggedInScietyUser,
} from '../authentication-and-logging-in-of-sciety-users';
import { renderFormPage } from '../../html-pages/create-user-account-form-page/create-user-account-form-page';
import { createUserAccountFormPageLayout } from '../../html-pages/create-user-account-form-page/create-user-account-form-page-layout';
import { toWebPage } from '../page-handler';
import { validateAndExecuteCommand, Dependencies as ValidateAndExecuteCommandPorts } from './validate-and-execute-command';
import { redirectToAuthenticationDestination } from '../authentication-destination';
import { ViewModel } from '../../html-pages/create-user-account-form-page/view-model';
import { UserGeneratedInput, userGeneratedInputCodec } from '../../types/user-generated-input';

type Dependencies = GetLoggedInScietyUserPorts & ValidateAndExecuteCommandPorts;

const unvalidatedFormDetailsCodec = t.type({
  fullName: tt.withFallback(userGeneratedInputCodec({ maxInputLength: 1000 }), '' as UserGeneratedInput),
  handle: tt.withFallback(userGeneratedInputCodec({ maxInputLength: 1000 }), '' as UserGeneratedInput),
});

export const createUserAccount = (dependencies: Dependencies): Middleware => async (context, next) => {
  const result = await validateAndExecuteCommand(context, dependencies)();

  if (E.isRight(result)) {
    redirectToAuthenticationDestination(context);
    return;
  }

  if (E.isLeft(result) && result.left === 'command-failed') {
    context.response.status = StatusCodes.INTERNAL_SERVER_ERROR;
    context.response.body = 'Your input appears to be valid but we failed to handle it.';
    return;
  }

  if (E.isLeft(result) && result.left === 'no-authenticated-user-id') {
    context.response.status = StatusCodes.UNAUTHORIZED;
    context.response.body = 'You must be authenticated to perform this action.';
    return;
  }

  if (E.isLeft(result) && result.left === 'validation-error') {
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
        handle: formDetails.fullName,
        fullName: formDetails.fullName,
        validationRecovery: O.none,
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

  await next();
};
