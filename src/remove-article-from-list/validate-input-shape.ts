import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import { Command } from './execute-command';

type ValidateInputShape = (codec: t.Decoder<unknown, Command>) => (input: unknown) => E.Either<string, Command>;

export const validateInputShape: ValidateInputShape = (codec) => (input) => pipe(
  input,
  codec.decode,
  E.mapLeft((errors) => PR.failure(errors).join('\n')),
);
