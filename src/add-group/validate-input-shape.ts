import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import { Command } from './execute-command';

const inputCodec = t.type({
  name: t.string,
  shortDescription: t.string,
  homepage: t.string,
  avatarPath: t.string,
  descriptionPath: t.string,
  slug: t.string,
});

type ValidateInputShape = (input: unknown) => E.Either<string, Command>;

export const validateInputShape: ValidateInputShape = (input) => pipe(
  input,
  inputCodec.decode,
  E.mapLeft((errors) => PR.failure(errors).join('\n')),
);
