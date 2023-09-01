import { Middleware } from '@koa/router';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { renderErrorPage } from './render-error-page';
import { standardPageLayout } from '../html-pages/layouts';
import { toHtmlFragment } from '../types/html-fragment';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users';

export const routeNotFound = (adapters: GetLoggedInScietyUserPorts): Middleware => async (context, next) => {
  if (context._matchedRoute === undefined) {
    context.status = StatusCodes.NOT_FOUND;
    context.body = pipe(
      {
        title: 'Page not found',
        content: renderErrorPage(toHtmlFragment('Page not found.')),
      },
      standardPageLayout(getLoggedInScietyUser(adapters, context)),
    );
  }
  await next();
};
