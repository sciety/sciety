import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import {
  Ports as GetLoggedInScietyUserPorts, getLoggedInScietyUser,
} from '../authentication-and-logging-in-of-sciety-users';
import { renderFormPage } from '../../html-pages/create-user-account-form-page/create-user-account-form-page';
import { createUserAccountFormPageLayout } from '../../html-pages/create-user-account-form-page/create-user-account-form-page-layout';
import { toWebPage } from '../../html-pages/to-web-page';
import { validateAndExecuteCommand, Dependencies as ValidateAndExecuteCommandPorts } from './validate-and-execute-command';
import { redirectToAuthenticationDestination } from '../authentication-destination';

type Dependencies = GetLoggedInScietyUserPorts & ValidateAndExecuteCommandPorts;

export const createUserAccount = (dependencies: Dependencies): Middleware => async (context, next) => {
  await pipe(
    validateAndExecuteCommand(context, dependencies),
    TE.bimap(
      (formDetails) => {
        const page = pipe(
          {
            errorSummary: O.some(''),
          },
          renderFormPage(formDetails.fullName, formDetails.handle),
          E.right,
          toWebPage(getLoggedInScietyUser(dependencies, context), createUserAccountFormPageLayout),
        );
        context.response.status = page.status;
        context.response.type = 'html';
        context.response.body = page.body;
      },
      () => redirectToAuthenticationDestination(context),
    ),
  )();
  await next();
};
