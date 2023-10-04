import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { renderErrorPage } from './render-error-page';
import * as DE from '../types/data-error';
import { HtmlPage } from '../types/html-page';
import { RenderPageError } from '../types/render-page-error';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users';
import { UserDetails } from '../types/user-details';
import { ConstructPage } from '../html-pages/construct-page';

type ErrorToWebPage = (
  user: O.Option<UserDetails>,
) => (
  error: RenderPageError
) => {
  body: string,
  status: StatusCodes.NOT_FOUND | StatusCodes.SERVICE_UNAVAILABLE,
};

type PageLayout = (user: O.Option<UserDetails>) => (page: HtmlPage) => string;

const toErrorResponse: ErrorToWebPage = (user) => (error) => pipe(
  renderErrorPage(error.message),
  (content) => ({
    title: 'Error',
    content,
  }),
  standardPageLayout(user),
  (body) => ({
    body,
    status: pipe(
      error.type,
      DE.match({
        notFound: () => StatusCodes.NOT_FOUND,
        unavailable: () => StatusCodes.SERVICE_UNAVAILABLE,
      }),
    ),
  }),
);

const pageToSuccessResponse = (
  user: O.Option<UserDetails>,
  pageLayout: PageLayout,
) => (page: HtmlPage) => ({
  body: pageLayout(user)(page),
  status: StatusCodes.OK,
});

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const toWebPage = (user: O.Option<UserDetails>, pageLayout: PageLayout) => E.fold(
  toErrorResponse(user),
  pageToSuccessResponse(user, pageLayout),
);

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
      T.map(toWebPage(getLoggedInScietyUser(adapters, context), pageLayout)),
    )();

    context.response.status = response.status;
    context.response.type = 'html';
    context.response.body = response.body;

    await next();
  }
);
