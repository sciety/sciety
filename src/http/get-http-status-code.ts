import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as DE from '../types/data-error';
import { HtmlResponse } from '../html-pages/construct-html-response';

export const getHttpStatusCode = (htmlResponse: HtmlResponse): StatusCodes => pipe(
  htmlResponse.error,
  O.match(
    () => StatusCodes.OK,
    (error) => pipe(
      error,
      DE.match({
        notFound: () => StatusCodes.NOT_FOUND,
        unavailable: () => StatusCodes.SERVICE_UNAVAILABLE,
      }),
    ),
  ),
);
