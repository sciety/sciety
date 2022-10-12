import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';

type ValidateInputShape = <C>(codec: t.Decoder<unknown, C>) => (input: unknown) => E.Either<string, C>;

export const validateInputShape: ValidateInputShape = (codec) => (input) => pipe(
  input,
  codec.decode,
  E.mapLeft((errors) => PR.failure(errors).join('\n')),
);
