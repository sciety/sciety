import { StatusCodes } from 'http-status-codes';
import { ParameterizedContext } from 'koa';
import { getAuthenticatedUserIdFromContext, Dependencies as GetLoggedInScietyUserDependencies } from './authentication-and-logging-in-of-sciety-users';
import { detectClientClassification } from './detect-client-classification';
import { DependenciesForViews } from '../read-side/dependencies-for-views';
import { toDefaultErrorHtmlDocument } from '../read-side/html-pages/to-default-error-html-document';

export type Dependencies = GetLoggedInScietyUserDependencies & DependenciesForViews;

export const sendDefaultErrorHtmlResponse = (
  dependencies: Dependencies,
  context: ParameterizedContext,
  statusCode: StatusCodes,
  errorMessage: string,
): void => {
  context.response.status = statusCode;
  context.response.type = 'html';
  context.response.body = toDefaultErrorHtmlDocument(
    dependencies,
    getAuthenticatedUserIdFromContext(context),
    errorMessage,
    detectClientClassification(context),
  );
};
