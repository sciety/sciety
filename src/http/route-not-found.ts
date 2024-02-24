import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import { Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users.js';
import { sendDefaultErrorHtmlResponse } from './send-default-error-html-response.js';

export const respondWithNotFoundIfNoRoutesMatched = (
  adapters: GetLoggedInScietyUserPorts,
): Middleware => async (context, next) => {
  if (context._matchedRoute === undefined) {
    sendDefaultErrorHtmlResponse(adapters, context, StatusCodes.NOT_FOUND, 'Page not found.');
  }
  await next();
};
