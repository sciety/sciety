import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Middleware, ParameterizedContext } from 'koa';
import { validateAndExecuteCommand, Dependencies as ValidateAndExecuteCommandDependencies } from './validate-and-execute-command';
import { constructHtmlResponse } from '../../read-side/html-pages/construct-html-response';
import { createUserAccountFormPageLayout, renderFormPage } from '../../read-side/html-pages/create-user-account-form-page';
import { UserDetails } from '../../types/user-details';
import {
  getAuthenticatedUserIdFromContext,
} from '../authentication-and-logging-in-of-sciety-users';
import { redirectToAuthenticationDestination } from '../authentication-destination';
import { detectClientClassification } from '../detect-client-classification';
import { GetLoggedInScietyUserDependencies } from '../page-handler';
import { sendHtmlResponse } from '../send-html-response';

type Dependencies = GetLoggedInScietyUserDependencies & ValidateAndExecuteCommandDependencies;

const getLoggedInScietyUser = (
  dependencies: Dependencies,
  context: ParameterizedContext,
): O.Option<UserDetails> => pipe(
  context,
  getAuthenticatedUserIdFromContext,
  O.chain((id) => dependencies.lookupUser(id)),
);

export const createUserAccount = (dependencies: Dependencies): Middleware => async (context) => {
  const result = await validateAndExecuteCommand(context, dependencies)();
  if (E.isLeft(result)) {
    const formDetails = result.left;
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
    return;
  }

  redirectToAuthenticationDestination(context);
};
