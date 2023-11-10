import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import { Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users';
import { sendErrorHtmlResponse } from './send-error-html-response';

export const respondWithNotFoundIfNoRoutesMatched = (
  adapters: GetLoggedInScietyUserPorts,
): Middleware => async (context, next) => {
  if (context._matchedRoute === undefined) {
    sendErrorHtmlResponse(adapters, context, StatusCodes.NOT_FOUND, 'Page not found.');
  }
  await next();
};
