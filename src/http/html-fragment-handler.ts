import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { ConstructPage } from '../html-pages/construct-page';
import { PageLayout } from '../html-pages/page-layout';
import { pageToSuccessResponse, toErrorResponse } from '../html-pages/construct-html-response';
import { setResponseOnContext } from './set-response-on-context';

export const htmlFragmentHandler = (
  handler: ConstructPage,
  pageLayout: PageLayout = standardPageLayout,
): Middleware => async (context, next) => {
  const response = await pipe(
    context.params,
    handler,
    T.map(
      E.fold(
        toErrorResponse(O.none),
        pageToSuccessResponse(O.none, pageLayout),
      ),
    ),
  )();

  setResponseOnContext(response, context);

  await next();
};
