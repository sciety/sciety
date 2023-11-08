import { Middleware } from '@koa/router';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users';
import { ConstructPage } from '../html-pages/construct-page';
import { PageLayout } from '../html-pages/page-layout';
import { constructHtmlResponse } from '../html-pages/construct-html-response';
import { setResponseOnContext } from './set-response-on-context';

export const htmlFragmentHandler = (
  adapters: GetLoggedInScietyUserPorts,
  handler: ConstructPage,
  pageLayout: PageLayout = standardPageLayout,
): Middleware => async (context, next) => {
  const response = await pipe(
    {
      ...context.params,
      ...context.query,
      ...context.state,
      user: undefined,
    },
    handler,
    T.map(constructHtmlResponse(getLoggedInScietyUser(adapters, context), pageLayout)),
  )();

  setResponseOnContext(response, context);

  await next();
};
