import { Middleware } from '@koa/router';
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { ConstructPage } from '../html-pages/construct-page';
import { toErrorResponse } from '../html-pages/construct-html-response';
import { setResponseOnContext } from './set-response-on-context';
import { toCompleteHtmlDocument } from '../html-pages/complete-html-document';

export const htmlFragmentHandler = (
  handler: ConstructPage,
): Middleware => async (context, next) => {
  const response = await pipe(
    context.params,
    handler,
    T.map(
      E.fold(
        toErrorResponse(O.none),
        (page) => ({
          document: toCompleteHtmlDocument(page.content),
          error: O.none,
        }),
      ),
    ),
  )();

  setResponseOnContext(response, context);

  await next();
};
