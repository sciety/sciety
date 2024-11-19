import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { ParameterizedContext } from 'koa';
import { getAuthenticatedUserIdFromContext } from './authentication-and-logging-in-of-sciety-users';
import { detectClientClassification } from './detect-client-classification';
import { sendHtmlResponse } from './send-html-response';
import { sendRedirect } from './send-redirect';
import { Queries } from '../read-models';
import { ErrorPageViewModel } from '../read-side/html-pages/construct-error-page-view-model';
import { constructHtmlResponse } from '../read-side/html-pages/construct-html-response';
import { ConstructLoggedInPage, ConstructPage } from '../read-side/html-pages/construct-page';
import { HtmlPage } from '../read-side/html-pages/html-page';
import { PageLayout } from '../read-side/html-pages/page-layout';
import { RedirectTarget } from '../read-side/html-pages/redirect-target';
import { standardPageLayout } from '../read-side/html-pages/shared-components/standard-page-layout';
import { UserDetails } from '../types/user-details';

export type GetLoggedInScietyUserDependencies = Pick<Queries, 'lookupUser'>;
/**
 * @deprecated
 *
 * - If only the UserId is necessary, replace with call to getAuthenticatedUserIdFromContext.
 *
 * - If you require UserDetails, inline this pipe or hide a copy of this function into the caller.
 * This exposes the query and makes it possible to move it down into the read-side
 * e.g. with a layout view we don't have yet.
 */
const getLoggedInScietyUser = (
  dependencies: GetLoggedInScietyUserDependencies,
  context: ParameterizedContext,
): O.Option<UserDetails> => pipe(
  context,
  getAuthenticatedUserIdFromContext,
  O.chain((id) => dependencies.lookupUser(id)),
);

const constructAndSendHtmlResponse = (
  dependencies: GetLoggedInScietyUserDependencies,
  pageLayout: PageLayout,
  context: ParameterizedContext,
) => (input: E.Either<ErrorPageViewModel, HtmlPage>) => pipe(
  input,
  constructHtmlResponse(
    getLoggedInScietyUser(dependencies, context),
    pageLayout,
    detectClientClassification(context),
  ),
  sendHtmlResponse(context),
);

const sendHtmlResponseOrRedirect = (
  dependencies: GetLoggedInScietyUserDependencies,
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
  dependencies: Queries,
  handler: ConstructPage,
  pageLayout: PageLayout = standardPageLayout,
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
  dependencies: GetLoggedInScietyUserDependencies,
  handler: ConstructLoggedInPage,
  pageLayout: PageLayout = standardPageLayout,
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
