import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { validateAndExecuteCommand, Dependencies as ValidateAndExecuteCommandDependencies } from './validate-and-execute-command';
import { constructHtmlResponse } from '../../read-side/html-pages/construct-html-response';
import { createUserAccountFormPageLayout, renderFormPage } from '../../read-side/html-pages/create-user-account-form-page';
import {
  Dependencies as GetLoggedInScietyUserDependencies, getLoggedInScietyUser,
} from '../authentication-and-logging-in-of-sciety-users';
import { redirectToAuthenticationDestination } from '../authentication-destination';
import { detectClientClassification } from '../detect-client-classification';
import { sendHtmlResponse } from '../send-html-response';

type Dependencies = GetLoggedInScietyUserDependencies & ValidateAndExecuteCommandDependencies;

export const createUserAccount = (dependencies: Dependencies): Middleware => async (context) => {
  await pipe(
    validateAndExecuteCommand(context, dependencies),
    TE.bimap(
      (formDetails) => {
        const htmlResponse = pipe(
          {
            errorSummary: O.some(''),
          },
          renderFormPage(formDetails.fullName, formDetails.handle),
          E.right,
          constructHtmlResponse(
            getLoggedInScietyUser(dependencies, context),
            createUserAccountFormPageLayout,
            detectClientClassification(context),
          ),
        );
        sendHtmlResponse(context)(htmlResponse);
      },
      () => redirectToAuthenticationDestination(context),
    ),
  )();
};
