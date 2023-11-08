import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { ConstructPage } from '../html-pages/construct-page';
import { getHttpStatusCode } from './get-http-status-code';

export const htmlFragmentHandler = (
  handler: ConstructPage,
): Middleware => async (context, next) => {
  const response = await pipe(
    context.params,
    handler,
    T.map(
      E.fold(
        (error) => pipe(
          error.message,
          (content) => ({
            title: 'Error',
            content,
          }),
          (document) => ({
            document: document.content,
            error: O.some(error.type),
          }),
        ),
        (page) => ({
          document: page.content,
          error: O.none,
        }),
      ),
    ),
  )();

  context.response.status = getHttpStatusCode(response.error);
  context.response.type = 'html';
  context.response.body = response.document;

  await next();
};
