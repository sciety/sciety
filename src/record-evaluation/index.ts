import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';

const validateInputShape = (): E.Either<unknown, unknown> => E.right('');

const executeCommand = () => E.right([]);

const commitEvents = () => {};

type RecordEvaluation = (input: unknown) => void;

export const recordEvaluation: RecordEvaluation = (input) => pipe(
  input,
  validateInputShape,
  E.chainW(executeCommand),
  E.map(commitEvents),
);
