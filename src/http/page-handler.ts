import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users';
import { ConstructPage } from '../html-pages/construct-page';
import { PageLayout } from '../html-pages/page-layout';
import { constructHtmlResponse } from '../html-pages/construct-html-response';
import { getHttpStatusCode } from './get-http-status-code';

export const pageHandler = (
  adapters: GetLoggedInScietyUserPorts,
  handler: ConstructPage,
  pageLayout: PageLayout = standardPageLayout,
): Middleware => (
  async (context, next) => {
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
      T.map(constructHtmlResponse(getLoggedInScietyUser(adapters, context), pageLayout)),
      T.map((htmlResponse) => ({
        body: htmlResponse.content,
        status: getHttpStatusCode(htmlResponse),
      })),
    )();

    context.response.status = response.status;
    context.response.type = 'html';
    context.response.body = response.body;

    await next();
  }
);
