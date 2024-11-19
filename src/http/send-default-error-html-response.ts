import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { ParameterizedContext } from 'koa';
import { getAuthenticatedUserIdFromContext } from './authentication-and-logging-in-of-sciety-users';
import { detectClientClassification } from './detect-client-classification';
import { GetLoggedInScietyUserDependencies } from './page-handler';
import { toDefaultErrorHtmlDocument } from '../read-side/html-pages/to-default-error-html-document';

export type Dependencies = GetLoggedInScietyUserDependencies;

export const sendDefaultErrorHtmlResponse = (
  dependencies: Dependencies,
  context: ParameterizedContext,
  statusCode: StatusCodes,
  errorMessage: string,
): void => {
  context.response.status = statusCode;
  context.response.type = 'html';
  const provideLoggedInUserDetails = pipe(
    context,
    getAuthenticatedUserIdFromContext,
    O.chain((id) => dependencies.lookupUser(id)),
  );
  context.response.body = toDefaultErrorHtmlDocument(
    errorMessage,
    detectClientClassification(context),
    provideLoggedInUserDetails,
  );
};
