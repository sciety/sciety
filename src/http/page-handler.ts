import { Middleware } from '@koa/router';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { NOT_FOUND, OK, SERVICE_UNAVAILABLE } from 'http-status-codes';
import { renderErrorPage } from './render-error-page';
import { applyStandardPageLayout, Page } from '../shared-components/apply-standard-page-layout';
import { RenderPageError } from '../types/render-page-error';
import { User } from '../types/user';

// TODO: find better way of handling params of different pages
type RenderPage = (params: {
  doi?: string;
  id?: string;
  query?: string;
  flavour?: string;
  user: O.Option<User>;
}) => TE.TaskEither<RenderPageError, Page>;

const addScietySuffixIfNotHomepage = (requestPath: string) => (page: Page): Page => ({
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

const pageToWebPage = (user: O.Option<User>, requestPath: string) => (page: Page): string => pipe(
  page,
  addScietySuffixIfNotHomepage(requestPath),
  applyStandardPageLayout(user),
);

export default (
  renderPage: RenderPage,
): Middleware<{ user?: User }> => (
  async (context, next): Promise<void> => {
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
          status: error.type === 'not-found' ? NOT_FOUND : SERVICE_UNAVAILABLE,
        }),
        (page) => T.of({
          body: pageToWebPage(user, context.request.path)(page),
          status: OK,
        }),
      ),
    )();

    context.response.type = 'html';
    Object.assign(context.response, response);

    await next();
  }
);
