import { Middleware } from '@koa/router';
import { NOT_FOUND, OK, SERVICE_UNAVAILABLE } from 'http-status-codes';
import { Maybe, Result } from 'true-myth';
import applyStandardPageLayout from '../shared-components/apply-standard-page-layout';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';
import { User } from '../types/user';

export type Page = {
  content: HtmlFragment,
  openGraph?: {
    title: string;
    description: string;
  }
};

type RenderedPage = Result<Page, RenderPageError>;

// TODO: find better way of handling params of different pages
type RenderPage = (params: {
  doi?: string;
  id?: string;
  query?: string;
  flavour?: string;
  user: Maybe<User>;
}) => Promise<RenderedPage>;

const successToStatusCode = (): number => OK;

const errorTypeToStatusCode = ({ type }: RenderPageError): number => (
  type === 'not-found' ? NOT_FOUND : SERVICE_UNAVAILABLE
);

type RenderErrorPage = (description: HtmlFragment) => HtmlFragment;

const renderErrorPage: RenderErrorPage = (description) => toHtmlFragment(`
  <div class="sciety-grid sciety-grid--simple">
    <h1>Oops!</h1>
    <p>
      ${description}
    </p>
    <p>
      <a href="/" class="u-call-to-action-link">Return to Homepage</a>
    </p>
  </div>
`);

export const renderFullPage = (pageResult: RenderedPage, user: Maybe<User>): string => {
  const page = pageResult.unwrapOrElse((error) => ({
    content: renderErrorPage(error.description),
  }));
  return applyStandardPageLayout(page, user);
};

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
    const page = await renderPage(params);

    context.response.status = page.map(successToStatusCode).unwrapOrElse(errorTypeToStatusCode);

    context.response.body = renderFullPage(page, user);

    await next();
  }
);
