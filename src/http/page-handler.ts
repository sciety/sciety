import { Middleware } from '@koa/router';
import { NOT_FOUND, OK, SERVICE_UNAVAILABLE } from 'http-status-codes';
import { Maybe, Result } from 'true-myth';
import applyStandardPageLayout from '../shared-components/apply-standard-page-layout';
import { User } from '../types/user';

type Page = {
  content: string,
  title?: string,
  description?: string,
};

type RenderPageError = {
  type: 'not-found' | 'unavailable',
  content: string
};

// TODO: deprecate and remove strings from the return type in favor of Page
type RenderPage = (params: {
  doi?: string;
  id?: string;
  query?: string;
  flavour?: string;
  user: Maybe<User>;
}) => Promise<string | Result<string | Page, RenderPageError>>;

const successToStatusCode = (): number => OK;

const errorTypeToStatusCode = ({ type }: RenderPageError): number => (
  type === 'not-found' ? NOT_FOUND : SERVICE_UNAVAILABLE
);

export default (
  renderPage: RenderPage,
): Middleware<{ user?: User }> => (
  async (context, next): Promise<void> => {
    const params = {
      ...context.params,
      ...context.query,
      ...context.state,
      user: Maybe.of(context.state.user),
    };
    context.response.type = 'html';

    const rendered = await renderPage(params);

    const user = Maybe.of(context.state.user);

    let result: Result<Page, RenderPageError>;

    if (typeof rendered === 'string') {
      result = Result.ok({ content: rendered });
    } else {
      result = rendered.map((page) => (typeof page === 'string' ? { content: page } : page));
    }

    const page = result.unwrapOrElse((error) => error);

    context.response.status = result.map(successToStatusCode).unwrapOrElse(errorTypeToStatusCode);
    context.response.body = applyStandardPageLayout({
      ...page,
      title: Maybe.of(page.title),
      description: Maybe.of(page.description),
    }, user);

    await next();
  }
);
