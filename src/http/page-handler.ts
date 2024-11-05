import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ParameterizedContext } from 'koa';
import { getAuthenticatedUserIdFromContext } from './authentication-and-logging-in-of-sciety-users';
import { detectClientClassification } from './detect-client-classification';
import { sendHtmlResponse } from './send-html-response';
import { sendRedirect } from './send-redirect';
import { ErrorPageViewModel } from '../read-side/html-pages/construct-error-page-view-model';
import { constructHtmlResponseWithDependencies, Dependencies as ConstructHtmlResponseDependencies } from '../read-side/html-pages/construct-html-response';
import { ConstructLoggedInPage, ConstructPage } from '../read-side/html-pages/construct-page';
import { HtmlPage } from '../read-side/html-pages/html-page';
import { PageLayout } from '../read-side/html-pages/page-layout';
import { RedirectTarget } from '../read-side/html-pages/redirect-target';
import { renderStandardPageLayout } from '../read-side/html-pages/shared-components/standard-page-layout';

const constructAndSendHtmlResponse = (
  dependencies: ConstructHtmlResponseDependencies,
  pageLayout: PageLayout,
  context: ParameterizedContext,
) => (input: E.Either<ErrorPageViewModel, HtmlPage>) => pipe(
  input,
  constructHtmlResponseWithDependencies(
    dependencies,
    pipe(
      context,
      getAuthenticatedUserIdFromContext,
    ),
    pageLayout,
    detectClientClassification(context),
  ),
  sendHtmlResponse(context),
);

const sendHtmlResponseOrRedirect = (
  dependencies: ConstructHtmlResponseDependencies,
  context: ParameterizedContext,
  pageLayout: PageLayout,
  result: E.Either<ErrorPageViewModel | RedirectTarget, HtmlPage>,
) => {
  if (E.isRight(result)) {
    constructAndSendHtmlResponse(dependencies, pageLayout, context)(E.right(result.right));
  } else {
    switch (result.left.tag) {
      case 'error-page-view-model':
        constructAndSendHtmlResponse(dependencies, pageLayout, context)(E.left(result.left));
        break;
      case 'redirect-target':
        sendRedirect(context, result.left);
        break;
    }
  }
};

export const pageHandler = (
  dependencies: ConstructHtmlResponseDependencies,
  handler: ConstructPage,
  pageLayout: PageLayout = renderStandardPageLayout,
): Middleware => async (context, next) => {
  const result = await pipe(
    {
      ...context.params,
      ...context.query,
      ...context.state,
    },
    (partialParams) => pipe(
      getAuthenticatedUserIdFromContext(context),
      O.chain((id) => dependencies.lookupUser(id)),
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
  sendHtmlResponseOrRedirect(dependencies, context, pageLayout, result);

  await next();
};

export const pageHandlerWithLoggedInUser = (
  dependencies: ConstructHtmlResponseDependencies,
  handler: ConstructLoggedInPage,
  pageLayout: PageLayout = renderStandardPageLayout,
): Middleware => async (context, next) => {
  const loggedInUserId = getAuthenticatedUserIdFromContext(context);
  if (O.isNone(loggedInUserId)) {
    context.redirect('/log-in');
    return;
  }
  const result = await handler(
    loggedInUserId.value,
    {
      ...context.params,
      ...context.query,
    },
  )();
  sendHtmlResponseOrRedirect(dependencies, context, pageLayout, result);

  await next();
};
