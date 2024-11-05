import { Middleware } from '@koa/router';
import { StatusCodes } from 'http-status-codes';
import { Dependencies as SendDefaultErrorHtmlResponseDependencies, sendDefaultErrorHtmlResponse } from './send-default-error-html-response';

export const respondWithNotFoundIfNoRoutesMatched = (
  dependencies: SendDefaultErrorHtmlResponseDependencies,
): Middleware => async (context, next) => {
  if (context._matchedRoute === undefined) {
    sendDefaultErrorHtmlResponse(dependencies, context, StatusCodes.NOT_FOUND, 'Page not found.');
  }
  await next();
};
