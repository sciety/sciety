import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { AddGroupCommand, addGroupCommandCodec } from '../commands';

type ValidateInputShape = (input: unknown) => E.Either<string, AddGroupCommand>;

export const validateInputShape: ValidateInputShape = (input) => pipe(
  input,
  addGroupCommandCodec.decode,
  E.mapLeft((errors) => PR.failure(errors).join('\n')),
);
