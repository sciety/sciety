import { Middleware } from '@koa/router';
import { NOT_FOUND, OK } from 'http-status-codes';
import { Maybe, Result } from 'true-myth';
import applyStandardPageLayout from '../templates/apply-standard-page-layout';
import { User } from '../types/user';

type RenderPageError = {
  type: 'not-found',
  content: string
};

type RenderPage = (params: {
  doi?: string;
  id?: string;
  query?: string;
  userId?: string;
  user: Maybe<User>;
}) => Promise<string | Result<string, RenderPageError>>;

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
      context.response.status = page.isOk() ? OK : NOT_FOUND;
      context.response.body = applyStandardPageLayout(page.unwrapOrElse((error) => error.content), user);
    }

    await next();
  }
);
