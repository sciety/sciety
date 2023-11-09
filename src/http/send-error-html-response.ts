import { StatusCodes } from 'http-status-codes';
import { ParameterizedContext } from 'koa';
import { toErrorHtmlDocument } from '../html-pages/to-error-html-document';
import { detectClientClassification } from './detect-client-classification';
import { Ports as GetLoggedInScietyUserPorts, getLoggedInScietyUser } from './authentication-and-logging-in-of-sciety-users';

export type Dependencies = GetLoggedInScietyUserPorts;

export const sendErrorHtmlResponse = (
  dependencies: Dependencies,
  context: ParameterizedContext,
  statusCode: StatusCodes,
  errorMessage: string,
): void => {
  context.response.status = statusCode;
  context.response.body = toErrorHtmlDocument(
    errorMessage,
    detectClientClassification(context),
    getLoggedInScietyUser(dependencies, context),
  );
};
