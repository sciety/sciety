import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { standardPageLayout } from '../shared-components/standard-page-layout.js';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users.js';
import { ConstructPage } from '../html-pages/construct-page.js';
import { PageLayout } from '../html-pages/page-layout.js';
import { constructHtmlResponse } from '../html-pages/construct-html-response.js';
import { sendHtmlResponse } from './send-html-response.js';
import { detectClientClassification } from './detect-client-classification.js';

export const pageHandler = (
  adapters: GetLoggedInScietyUserPorts,
  handler: ConstructPage,
  pageLayout: PageLayout = standardPageLayout,
): Middleware => async (context, next) => {
  const response = await pipe(
    {
      ...context.params,
      ...context.query,
      ...context.state,
    },
    (partialParams) => pipe(
      getLoggedInScietyUser(adapters, context),
      O.foldW(
        () => ({
          ...partialParams,
          user: undefined,
        }),
        (user) => ({
          ...partialParams,
          user,
        }),
      ),
    ),
    handler,
    T.map(constructHtmlResponse(
      getLoggedInScietyUser(adapters, context),
      pageLayout,
      detectClientClassification(context),
    )),
  )();

  sendHtmlResponse(response, context);

  await next();
};
