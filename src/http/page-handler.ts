import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ParameterizedContext } from 'koa';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users';
import { detectClientClassification } from './detect-client-classification';
import { sendHtmlResponse } from './send-html-response';
import { sendRedirect } from './send-redirect';
import { constructHtmlResponse } from '../html-pages/construct-html-response';
import { ConstructPage } from '../html-pages/construct-page';
import { HtmlPage } from '../html-pages/html-page';
import { PageLayout } from '../html-pages/page-layout';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { ErrorPageBodyViewModel } from '../types/error-page-body-view-model';

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

export const pageHandler = (
  adapters: GetLoggedInScietyUserPorts,
  handler: ConstructPage,
  pageLayout: PageLayout = standardPageLayout,
): Middleware => async (context, next) => {
  const input = await pipe(
    {
      ...context.params,
      ...context.query,
      ...context.state,
    },
    (partialParams) => pipe(
      getLoggedInScietyUser(adapters, context),
      O.matchW(
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
  )();
  if (E.isRight(input)) {
    constructAndSendHtmlResponse(adapters, pageLayout, context)(E.right(input.right));
  } else {
    switch (input.left.tag) {
      case 'error-page-body-view-model':
        constructAndSendHtmlResponse(adapters, pageLayout, context)(E.left(input.left));
        break;
      case 'redirect-target':
        sendRedirect(context, input.left);
        break;
    }
  }

  await next();
};
