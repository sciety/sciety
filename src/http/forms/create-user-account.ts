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
import { toWebPage } from '../page-handler';
import { validateAndExecuteCommand, Dependencies as ValidateAndExecuteCommandPorts } from './validate-and-execute-command';
import { redirectToAuthenticationDestination } from '../authentication-destination';
import { ViewModel } from '../../html-pages/create-user-account-form-page/view-model';

type Dependencies = GetLoggedInScietyUserPorts & ValidateAndExecuteCommandPorts;

export const createUserAccount = (dependencies: Dependencies): Middleware => async (context, next) => {
  await pipe(
    validateAndExecuteCommand(context, dependencies),
    TE.bimap(
      (formDetails) => {
        const page = pipe(
          {
            pageHeader: 'Sign up',
            errorSummary: O.some(''),
            handle: formDetails.fullName,
            fullName: formDetails.fullName,
          } satisfies ViewModel,
          renderFormPage,
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
