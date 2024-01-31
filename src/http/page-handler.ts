import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { ParameterizedContext } from 'koa';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users';
import { ConstructPage, ConstructPageResult } from '../html-pages/construct-page';
import { PageLayout } from '../html-pages/page-layout';
import { constructHtmlResponse } from '../html-pages/construct-html-response';
import { sendHtmlResponse } from './send-html-response';
import { detectClientClassification } from './detect-client-classification';
import { ErrorPageBodyViewModel } from '../types/render-page-error';
import { sendRedirect } from './send-redirect';
import { HtmlPage } from '../html-pages/html-page';

const constructAndSendHtmlResponse = (
  adapters: GetLoggedInScietyUserPorts,
  pageLayout: PageLayout,
  context: ParameterizedContext,
) => (input: E.Either<ErrorPageBodyViewModel, HtmlPage>) => pipe(
  input,
  constructHtmlResponse(
    getLoggedInScietyUser(adapters, context),
    pageLayout,
    detectClientClassification(context),
  ),
  sendHtmlResponse(context),
);

const failIfRedirect = (
  adapters: GetLoggedInScietyUserPorts,
  pageLayout: PageLayout,
  context: ParameterizedContext,
) => (
  constructPageResult: E.Either<ErrorPageBodyViewModel, ConstructPageResult>,
): void => {
  if (E.isLeft(constructPageResult)) {
    return pipe(
      constructPageResult,
      constructAndSendHtmlResponse(adapters, pageLayout, context),
    );
  }
  if (constructPageResult.right.tag === 'redirect-target') {
    sendRedirect(context, constructPageResult.right);
    return;
  }
  return pipe(
    E.right(constructPageResult.right),
    constructAndSendHtmlResponse(adapters, pageLayout, context),
  );
};

export const pageHandler = (
  adapters: GetLoggedInScietyUserPorts,
  handler: ConstructPage,
  pageLayout: PageLayout = standardPageLayout,
): Middleware => async (context, next) => {
  await pipe(
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

  await next();
};
