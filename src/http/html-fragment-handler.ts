import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { getHttpStatusCode } from './get-http-status-code';
import { ErrorPageViewModel } from '../read-side/html-pages/construct-error-page-view-model';
import { HtmlPage } from '../read-side/html-pages/html-page';

type ConstructPage = (
  params: Record<string, unknown>,
) => TE.TaskEither<ErrorPageViewModel, HtmlPage>;

export const htmlFragmentHandler = (
  handler: ConstructPage,
): Middleware => async (context, next) => {
  const response = await pipe(
    context.params,
    handler,
    TE.match(
      (error) => ({
        fragment: error.message,
        error: O.some(error.type),
      }),
      (page) => ({
        fragment: page.content,
        error: O.none,
      }),
    ),
  )();

  context.response.status = getHttpStatusCode(response.error);
  context.response.type = 'html';
  context.response.body = response.fragment;

  await next();
};
