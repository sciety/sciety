import { Middleware } from '@koa/router';
import { NOT_FOUND, OK, SERVICE_UNAVAILABLE } from 'http-status-codes';
import { Maybe, Result } from 'true-myth';
import applyStandardPageLayout from '../templates/apply-standard-page-layout';
import { User } from '../types/user';

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
}) => Promise<string | Result<string, RenderPageError>>;

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

    const page = await renderPage(params);

    const user = Maybe.of(context.state.user);

    if (typeof page === 'string') {
      context.response.status = OK;
      context.response.body = applyStandardPageLayout(page, user);
    } else {
      context.response.status = page.map(successToStatusCode).unwrapOrElse(errorTypeToStatusCode);
      context.response.body = applyStandardPageLayout(page.unwrapOrElse(
        (error) => error.content,
      ),
      user);
    }

    await next();
  }
);
