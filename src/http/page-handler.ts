import { Middleware } from '@koa/router';
import * as E from 'fp-ts/lib/Either';
import * as O from 'fp-ts/lib/Option';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import { NOT_FOUND, OK, SERVICE_UNAVAILABLE } from 'http-status-codes';
import { Result } from 'true-myth';
import { renderErrorPage } from './render-error-page';
import { applyStandardPageLayout, Page } from '../shared-components/apply-standard-page-layout';
import { HtmlFragment } from '../types/html-fragment';
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

type InterimResult = {
  title: string;
  content: HtmlFragment;
  openGraph?: {
    title: string;
    description: string;
  };
  status: number;
};

const addScietySuffixIfNotHomepage = (requestPath: string) => (page: InterimResult): InterimResult => ({
  ...page,
  title: requestPath === '/' ? page.title : `${page.title} | Sciety`,
});

const toTaskEither = (rendered: T.Task<RenderedResult>): TE.TaskEither<RenderPageError, Page> => pipe(
  rendered,
  T.map((result) => result
    .map((page) => E.right<RenderPageError, Page>(page))
    .unwrapOrElse((error) => E.left<RenderPageError, Page>(error))),
  T.chain(TE.fromEither),
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
      toTaskEither,
      TE.fold(
        (error) => T.of({
          title: 'Error',
          content: renderErrorPage(error.message),
          status: error.type === 'not-found' ? NOT_FOUND : SERVICE_UNAVAILABLE,
        }),
        (page) => T.of({
          ...page,
          status: OK,
        }),
      ),
      T.map(addScietySuffixIfNotHomepage(context.request.path)),
      T.map((obj) => ({
        body: applyStandardPageLayout(user)(obj),
        status: obj.status,
      })),
    )();

    context.response.type = 'html';
    Object.assign(context.response, response);

    await next();
  }
);
