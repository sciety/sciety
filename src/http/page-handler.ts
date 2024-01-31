import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { URL } from 'url';
import { ParameterizedContext } from 'koa';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users';
import { ConstructPage, ConstructPageResult } from '../html-pages/construct-page';
import { PageLayout } from '../html-pages/page-layout';
import { constructHtmlResponse, HtmlResponse } from '../html-pages/construct-html-response';
import { sendHtmlResponse } from './send-html-response';
import { detectClientClassification } from './detect-client-classification';
import { toHtmlFragment } from '../types/html-fragment';
import { ErrorPageBodyViewModel } from '../types/render-page-error';

const failIfRedirect = (
  adapters: GetLoggedInScietyUserPorts,
  pageLayout: PageLayout,
  context: ParameterizedContext,
) => (
  constructPageResult: E.Either<ErrorPageBodyViewModel, ConstructPageResult>,
): HtmlResponse => {
  if (E.isLeft(constructPageResult)) {
    return pipe(
      constructPageResult,
      constructHtmlResponse(
        getLoggedInScietyUser(adapters, context),
        pageLayout,
        detectClientClassification(context),
      ),
    );
  }
  if (constructPageResult.right instanceof URL) {
    return pipe(E.right({
      title: '',
      content: toHtmlFragment(`<a href="${constructPageResult.right.toString()}">Click me!</a>`),
    }),
    constructHtmlResponse(
      getLoggedInScietyUser(adapters, context),
      pageLayout,
      detectClientClassification(context),
    ));
  }
  return pipe(
    E.right(constructPageResult.right),
    constructHtmlResponse(
      getLoggedInScietyUser(adapters, context),
      pageLayout,
      detectClientClassification(context),
    ),
  );
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
    T.map(failIfRedirect(adapters, pageLayout, context)),
  )();

  sendHtmlResponse(response, context);

  await next();
};
