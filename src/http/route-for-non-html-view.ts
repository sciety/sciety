import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { NonHtmlViewParams, NonHtmlViewRepresentation } from '../read-side/non-html-views';
import { NonHtmlViewError } from '../read-side/non-html-views/non-html-view-error';

type NonHtmlView = (
  params: NonHtmlViewParams,
) => TE.TaskEither<NonHtmlViewError, NonHtmlViewRepresentation>;

export const routeForNonHtmlView = (nonHtmlView: NonHtmlView): Middleware => async (context, next) => {
  const collectedParams: NonHtmlViewParams = context.params;
  const response = await pipe(
    collectedParams,
    nonHtmlView,
    TE.foldW(
      (error) => T.of({
        body: { message: error.message },
        status: error.status,
      }),
      (representation: NonHtmlViewRepresentation) => T.of({
        body: representation.state,
        status: StatusCodes.OK,
      }),
    ),
  )();

  context.response.status = response.status;
  context.response.body = response.body;
  await next();
};
