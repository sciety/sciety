import { Middleware } from '@koa/router';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';
import { NOT_FOUND, OK, SERVICE_UNAVAILABLE } from 'http-status-codes';
import { Result } from 'true-myth';
import { renderErrorPage } from './render-error-page';
import { applyStandardPageLayout, Page } from '../shared-components/apply-standard-page-layout';
import { RenderPageError } from '../types/render-page-error';
import { User } from '../types/user';

type RenderedResult = Result<Page, RenderPageError>;

// TODO: find better way of handling params of different pages
type RenderPage = (params: {
  doi?: string;
  id?: string;
  query?: string;
  flavour?: string;
  user: O.Option<User>;
}) => T.Task<RenderedResult>;

const successToStatusCode = (): number => OK;

const errorTypeToStatusCode = ({ type }: RenderPageError): number => (
  type === 'not-found' ? NOT_FOUND : SERVICE_UNAVAILABLE
);

type FoldToPage = (
  pageResult: RenderedResult,
) => Page;

const foldToPage: FoldToPage = (pageResult) => (
  pageResult.unwrapOrElse((error) => ({
    title: 'Error',
    content: renderErrorPage(error.message),
  }))
);

const addScietySuffixIfNotHomepage = (requestPath: string) => (page: Page): Page => ({
  ...page,
  title: requestPath === '/' ? page.title : `${page.title} | Sciety`,
});

const createResponse = (user: O.Option<User>, requestPath: string) => (rendered: RenderedResult) => ({
  type: 'html',
  body: pipe(
    rendered,
    foldToPage,
    addScietySuffixIfNotHomepage(requestPath),
    applyStandardPageLayout(user),
  ),
  status: rendered.map(successToStatusCode).unwrapOrElse(errorTypeToStatusCode),
});

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
      T.map(createResponse(user, context.request.path)),
    )();

    Object.assign(context.response, response);

    await next();
  }
);
