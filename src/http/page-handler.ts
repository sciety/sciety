import { Middleware } from '@koa/router';
import { NOT_FOUND, OK, SERVICE_UNAVAILABLE } from 'http-status-codes';
import { Maybe, Result } from 'true-myth';
import applyStandardPageLayout from '../shared-components/apply-standard-page-layout';
import { User } from '../types/user';

type Page = {
  content: string,
};

type RenderPageError = {
  type: 'not-found' | 'unavailable',
  content: string
};

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

    if (typeof rendered === 'string') {
      context.response.status = OK;
      context.response.body = applyStandardPageLayout(rendered, user);
    } else {
      context.response.status = rendered.map(successToStatusCode).unwrapOrElse(errorTypeToStatusCode);
      const content = rendered
        .map((page) => (typeof page === 'string' ? page : page.content))
        .unwrapOrElse((error) => error.content);
      context.response.body = applyStandardPageLayout(content, user);
    }

    await next();
  }
);
