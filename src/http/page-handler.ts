import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { renderErrorPage } from './render-error-page';
import { applyStandardPageLayout } from '../shared-components';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';
import { User } from '../types/user';

const errorToWebPage = (user: O.Option<User>) => (error: RenderPageError) => pipe(
  renderErrorPage(error.message),
  (content) => ({
    title: 'Error',
    content,
  }),
  applyStandardPageLayout(user),
  (body) => ({
    body,
    status: error.type === 'not-found' ? StatusCodes.NOT_FOUND : StatusCodes.SERVICE_UNAVAILABLE,
  }),
);

type PageLayout = (user: O.Option<User>) => (page: Page) => string;

const pageToWebPage = (pageLayout: PageLayout) => (user: O.Option<User>) => flow(
  pageLayout(user),
  (body) => ({
    body,
    status: StatusCodes.OK,
  }),
);

const toWebPage = (pageLayout: PageLayout) => (user: O.Option<User>) => E.fold(
  errorToWebPage(user),
  pageToWebPage(pageLayout)(user),
);

type HandlePage = (params: unknown) => TE.TaskEither<RenderPageError, Page>;

const genericPageHandler = (pageLayout: PageLayout) => (
  handler: HandlePage,
): Middleware => (
  async (context, next) => {
    const response = await pipe(
      {
        ...context.params,
        ...context.query,
        ...context.state,
      },
      handler,
      T.map(toWebPage(pageLayout)(O.fromNullable(context.state.user))),
    )();

    context.response.type = 'html';
    Object.assign(context.response, response);

    await next();
  }
);

export const pageHandler = genericPageHandler(applyStandardPageLayout);
