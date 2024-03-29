import { StatusCodes } from 'http-status-codes';
import { ParameterizedContext } from 'koa';
import { toDefaultErrorHtmlDocument } from '../html-pages/to-default-error-html-document';
import { detectClientClassification } from './detect-client-classification';
import { Ports as GetLoggedInScietyUserPorts, getLoggedInScietyUser } from './authentication-and-logging-in-of-sciety-users';

export type Dependencies = GetLoggedInScietyUserPorts;

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
