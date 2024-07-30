import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { Logger } from '../logger';

const logCodecFailure = (
  logger: Logger,
  codec: string,
  inputReceivedByCodec: unknown,
  payload: Record<string, unknown> = {},
) => (errors: t.Errors): t.Errors => {
  const formattedErrors = formatValidationErrors(errors, { truncateLongTypes: false });
  logger('error', 'Codec failure', {
    codec,
    inputReceivedByCodec,
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
  E.mapLeft(logCodecFailure(logger, codec.name, input, payload)),
);
