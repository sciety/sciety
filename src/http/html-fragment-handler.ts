import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { ConstructPage } from '../html-pages/construct-page';
import { getHttpStatusCode } from './get-http-status-code';
import { failIfRedirect } from './page-handler';

export const htmlFragmentHandler = (
  handler: ConstructPage,
): Middleware => async (context, next) => {
  const response = await pipe(
    context.params,
    handler,
    T.map(failIfRedirect),
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
