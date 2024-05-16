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
  const collectedParams: NonHtmlViewParams = { ...context.params, ...context.query };
  const response = await pipe(
    collectedParams,
    nonHtmlView,
    TE.foldW(
      (error) => T.of({
        status: error.status,
        contentType: 'application/json',
        body: { message: error.message },
      }),
      (representation: NonHtmlViewRepresentation) => T.of({
        status: StatusCodes.OK,
        contentType: representation.mediaType,
        body: representation.state,
      }),
    ),
  )();

  context.response.status = response.status;
  context.response.type = response.contentType;
  context.response.body = response.body;
  await next();
};
