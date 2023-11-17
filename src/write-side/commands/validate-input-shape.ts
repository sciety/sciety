import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { formatValidationErrors } from 'io-ts-reporters';
import { toErrorMessage, ErrorMessage } from '../../types/error-message.js';

type ValidateInputShape = <C>(codec: t.Decoder<unknown, C>) => (input: unknown) => E.Either<ErrorMessage, C>;

export const validateInputShape: ValidateInputShape = (codec) => (input) => pipe(
  input,
  codec.decode,
  E.mapLeft(formatValidationErrors),
  E.mapLeft((errors) => errors.join('\n')),
  E.mapLeft(toErrorMessage),
);
