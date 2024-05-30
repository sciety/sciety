import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import * as DE from '../types/data-error';

export const getHttpStatusCode = (error: O.Option<DE.DataError>): StatusCodes => pipe(
  error,
  O.match(
    () => StatusCodes.OK,
    DE.match({
      notFound: () => StatusCodes.NOT_FOUND,
      unavailable: () => StatusCodes.SERVICE_UNAVAILABLE,
      notAuthorised: () => StatusCodes.FORBIDDEN,
    }),
  ),
);
