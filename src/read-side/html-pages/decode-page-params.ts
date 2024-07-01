import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { Logger } from '../../logger';
import * as DE from '../../types/data-error';

export const decodePageParams = <P>(
  logger: Logger,
  paramsCodec: t.Decoder<unknown, P>,
) => (input: Record<string, unknown>): E.Either<DE.DataError, P> => pipe(
    input,
    paramsCodec.decode,
    E.mapLeft(formatValidationErrors),
    E.mapLeft((errors) => {
      logger('warn', 'pageParams codec failed', { errors });
      return DE.notFound;
    }),
  );
