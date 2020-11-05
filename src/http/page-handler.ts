import { Middleware } from '@koa/router';
import { NOT_FOUND, OK, SERVICE_UNAVAILABLE } from 'http-status-codes';
import { Maybe, Result } from 'true-myth';
import applyStandardPageLayout from '../shared-components/apply-standard-page-layout';
import { User } from '../types/user';

type Page = {
  content: string,
  openGraph?: {
    title: string;
    description: string;
  }
};

type RenderPageError = {
  type: 'not-found' | 'unavailable',
  content: string
};

// TODO: find better way of handling params of different pages
type RenderPage = (params: {
  doi?: string;
  id?: string;
  query?: string;
  flavour?: string;
  user: Maybe<User>;
}) => Promise<Result<Page, RenderPageError>>;

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

    const user = Maybe.of(context.state.user);

    // TODO: find more legible way of expressing this logic
    const rendered = await renderPage(params);

    context.response.status = rendered.map(successToStatusCode).unwrapOrElse(errorTypeToStatusCode);

    const page = rendered.unwrapOrElse((error) => error);
    context.response.body = applyStandardPageLayout(page, user);

    await next();
  }
);
