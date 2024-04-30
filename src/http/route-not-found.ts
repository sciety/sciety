import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import { Dependencies as GetLoggedInScietyUserDependencies } from './authentication-and-logging-in-of-sciety-users';
import { sendDefaultErrorHtmlResponse } from './send-default-error-html-response';

export const respondWithNotFoundIfNoRoutesMatched = (
  dependencies: GetLoggedInScietyUserDependencies,
): Middleware => async (context, next) => {
  if (context._matchedRoute === undefined) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.NOT_FOUND, 'Page not found.');
  }
  await next();
};
