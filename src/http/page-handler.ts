import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { URL } from 'url';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users';
import { ConstructPage, ConstructPageResult } from '../html-pages/construct-page';
import { PageLayout } from '../html-pages/page-layout';
import { constructHtmlResponse } from '../html-pages/construct-html-response';
import { sendHtmlResponse } from './send-html-response';
import { detectClientClassification } from './detect-client-classification';
import * as DE from '../types/data-error';
import { toHtmlFragment } from '../types/html-fragment';
import { ErrorPageBodyViewModel } from '../types/render-page-error';
import { HtmlPage } from '../html-pages/html-page';

export const failIfRedirect = (result: ConstructPageResult): E.Either<ErrorPageBodyViewModel, HtmlPage> => {
  if (result instanceof URL) {
    return E.left({
      type: DE.unavailable,
      message: toHtmlFragment('Not implemented yet.'),
    });
  }
  return E.right(result);
};

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
    TE.chainEitherKW(failIfRedirect),
    T.map(constructHtmlResponse(
      getLoggedInScietyUser(adapters, context),
      pageLayout,
      detectClientClassification(context),
    )),
  )();

  sendHtmlResponse(response, context);

  await next();
};
