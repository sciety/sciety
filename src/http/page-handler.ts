import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
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

const errorToWebPage = (user: O.Option<User>, requestPath: string) => (error: RenderPageError) => pipe(
  error,
  (e) => ({
    title: 'Error',
    content: renderErrorPage(e.message),
  }),
  addScietySuffixIfNotHomepage(requestPath),
  applyStandardPageLayout(user),
);

const pageToWebPage = (user: O.Option<User>, requestPath: string) => (page: Page) => pipe(
  page,
  addScietySuffixIfNotHomepage(requestPath),
  applyStandardPageLayout(user),
);

export const pageHandler = (
  renderPage: RenderPage,
): Middleware<{ user?: User }> => (
  async (context, next) => {
    const user = O.fromNullable(context.state.user);
    const params = {
      ...context.params,
      ...context.query,
      ...context.state,
      user,
    };

    const response = await pipe(
      params,
      renderPage,
      TE.fold(
        (error) => T.of({
          body: errorToWebPage(user, context.request.path)(error),
          status: error.type === 'not-found' ? StatusCodes.NOT_FOUND : StatusCodes.SERVICE_UNAVAILABLE,
        }),
        (page) => T.of({
          body: pageToWebPage(user, context.request.path)(page),
          status: StatusCodes.OK,
        }),
      ),
    )();

    context.response.type = 'html';
    Object.assign(context.response, response);

    await next();
  }
);
