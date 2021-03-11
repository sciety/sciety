import { Middleware, RouterContext } from '@koa/router';
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

// TODO: find better way of handling params of different pages
export type RenderPage = (params: {
  doi?: string,
  id?: string,
  query?: string,
  flavour?: string,
  user: O.Option<User>,
}) => TE.TaskEither<RenderPageError, Page>;

const addScietySuffixIfNotHomepage = (requestPath: string) => (page: Page) => ({
  ...page,
  title: requestPath === '/' ? page.title : `${page.title} | Sciety`,
});

const errorToWebPage = (user: O.Option<User>) => (error: RenderPageError) => pipe(
  renderErrorPage(error.message),
  (content) => ({
    title: 'Error | Sciety',
    content,
  }),
  applyStandardPageLayout(user),
  (body) => ({
    body,
    status: error.type === 'not-found' ? StatusCodes.NOT_FOUND : StatusCodes.SERVICE_UNAVAILABLE,
  }),
);

const pageToWebPage = (user: O.Option<User>, requestPath: string) => flow(
  addScietySuffixIfNotHomepage(requestPath),
  applyStandardPageLayout(user),
  (body) => ({
    body,
    status: StatusCodes.OK,
  }),
);

const toWebPage = (user: O.Option<User>, requestPath: string) => E.fold(
  errorToWebPage(user),
  pageToWebPage(user, requestPath),
);

const handlePage = (renderPage: RenderPage, context: RouterContext) => {
  const user = O.fromNullable(context.state.user);
  const params = {
    ...context.params,
    ...context.query,
    ...context.state,
    user: O.fromNullable(context.state.user),
  };

  return pipe(
    params,
    renderPage,
    T.map(toWebPage(user, context.request.path)),
  );
};

export const pageHandler = (
  renderPage: RenderPage,
): Middleware => (
  async (context, next) => {
    const response = await handlePage(renderPage, context)();

    context.response.type = 'html';
    Object.assign(context.response, response);

    await next();
  }
);
