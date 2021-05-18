import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { renderErrorPage } from './render-error-page';
import { applyStandardPageLayout } from '../shared-components/apply-standard-page-layout';
import { toHtmlFragment } from '../types/html-fragment';
import { User } from '../types/user';

export const routeNotFound: Middleware<{ user: User | undefined }> = async (context, next) => {
  const user = O.fromNullable(context.state.user);
  if (context._matchedRoute === undefined) {
    context.status = StatusCodes.NOT_FOUND;
    context.body = pipe(
      {
        title: 'Page not found',
        content: renderErrorPage(toHtmlFragment('Page not found.')),
      },
      applyStandardPageLayout(user),
    );
  }
  await next();
};
