import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { standardPageLayout } from '../shared-components/standard-page-layout';
import { renderErrorPage } from './render-error-page';
import * as DE from '../types/data-error';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { User } from '../types/user';
import { getLoggedInScietyUser, Ports as GetLoggedInScietyUserPorts } from './authentication-and-logging-in-of-sciety-users';

type ErrorToWebPage = (
  user: O.Option<User>,
  pageLayout: PageLayout,
) => (
  error: RenderPageError
) => {
  body: string,
  status: StatusCodes.NOT_FOUND | StatusCodes.SERVICE_UNAVAILABLE,
};

type PageLayout = (user: O.Option<User>) => (page: Page) => string;

const toErrorResponse: ErrorToWebPage = (user, pageLayout) => (error) => pipe(
  renderErrorPage(error.message),
  (content) => ({
    title: 'Error',
    content,
  }),
  pageLayout(user),
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
  user: O.Option<User>,
  applyPageLayout: boolean,
  pageLayout: PageLayout,
) => (page: Page) => ({
  body: (applyPageLayout) ? pageLayout(user)(page) : page.content,
  status: StatusCodes.OK,
});

const toWebPage = (user: O.Option<User>, applyPageLayout: boolean, pageLayout: PageLayout) => E.fold(
  toErrorResponse(user, pageLayout),
  pageToSuccessResponse(user, applyPageLayout, pageLayout),
);

type HandlePage = (params: unknown) => TE.TaskEither<RenderPageError, Page>;

export const pageHandler = (
  adapters: GetLoggedInScietyUserPorts,
  handler: HandlePage,
  applyPageLayout = true,
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
      T.map(toWebPage(getLoggedInScietyUser(adapters, context), applyPageLayout, pageLayout)),
    )();

    context.response.status = response.status;
    context.response.type = 'html';
    context.response.body = response.body;

    await next();
  }
);
