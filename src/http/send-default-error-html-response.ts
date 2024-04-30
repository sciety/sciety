import { StatusCodes } from 'http-status-codes';
import { ParameterizedContext } from 'koa';
import { Dependencies as GetLoggedInScietyUserDependencies, getLoggedInScietyUser } from './authentication-and-logging-in-of-sciety-users';
import { detectClientClassification } from './detect-client-classification';
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
  context.response.body = toDefaultErrorHtmlDocument(
    errorMessage,
    detectClientClassification(context),
    getLoggedInScietyUser(dependencies, context),
  );
};
