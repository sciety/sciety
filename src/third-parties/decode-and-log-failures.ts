import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { Logger } from '../infrastructure/index.js';

const logCodecFailure = (
  logger: Logger,
  codec: string,
  payload: Record<string, unknown> = {},
) => (errors: t.Errors): t.Errors => {
  const formattedErrors = formatValidationErrors(errors);
  logger('error', 'Codec failure', {
    codec,
    errors: formattedErrors,
    ...payload,
  });
  return errors;
};

type DecodeAndLogFailures = <P>(
  logger: Logger,
  codec: t.Decoder<unknown, P>,
  payload?: Record<string, unknown>
) => (input: unknown) => E.Either<t.Errors, P>;

export const decodeAndLogFailures: DecodeAndLogFailures = (
  logger,
  codec,
  payload = {},
) => (input) => pipe(
  input,
  codec.decode,
  E.mapLeft(logCodecFailure(logger, codec.name, payload)),
);
