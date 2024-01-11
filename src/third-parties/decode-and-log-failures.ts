import * as E from 'fp-ts/Either';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { Logger } from '../shared-ports';

const logCodecFailure = (
  logger: Logger,
  invokingFunction: string,
  codec: string,
  payload: Record<string, unknown> = {},
) => (errors: t.Errors): t.Errors => {
  const formattedErrors = formatValidationErrors(errors);
  logger('error', 'Codec failure', {
    invokingFunction,
    codec,
    errors: formattedErrors,
    ...payload,
  });
  return errors;
};

type DecodeAndLogFailures = <P>(
  logger: Logger,
  codec: t.Decoder<unknown, P>,
  invokingFunction: string,
  payload?: Record<string, unknown>
) => (input: unknown) => E.Either<t.Errors, P>;

export const decodeAndLogFailures: DecodeAndLogFailures = (
  logger,
  codec,
  invokingFunction,
  payload = {},
) => (input) => pipe(
  input,
  codec.decode,
  E.mapLeft(logCodecFailure(logger, invokingFunction, codec.name, payload)),
);
