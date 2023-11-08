import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { ConstructPage } from '../html-pages/construct-page';
import { PageLayout } from '../html-pages/page-layout';
import { constructHtmlResponse } from '../html-pages/construct-html-response';
import { setResponseOnContext } from './set-response-on-context';

export const htmlFragmentHandler = (
  handler: ConstructPage,
  pageLayout: PageLayout = standardPageLayout,
): Middleware => async (context, next) => {
  const response = await pipe(
    context.params,
    handler,
    T.map(constructHtmlResponse(O.none, pageLayout)),
  )();

  setResponseOnContext(response, context);

  await next();
};
