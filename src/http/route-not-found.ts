import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { toHtmlFragment } from '../types/html-fragment';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users';
import { constructHtmlResponse } from '../html-pages/construct-html-response';
import * as DE from '../types/data-error';
import { getHttpStatusCode } from './get-http-status-code';

export const routeNotFound = (adapters: GetLoggedInScietyUserPorts): Middleware => async (context, next) => {
  if (context._matchedRoute === undefined) {
    const htmlResponse = constructHtmlResponse(
      getLoggedInScietyUser(adapters, context),
      standardPageLayout,
    )(
      E.left({
        type: DE.notFound,
        message: toHtmlFragment('Page not found.'),
      }),
    );
    context.status = getHttpStatusCode(htmlResponse);
    context.body = htmlResponse.content;
  }
  await next();
};
