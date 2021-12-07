import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { RuntimeGeneratedEvent } from '../domain-events';

type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

type Ports = {
  commitEvents: CommitEvents,
};

const validateInputShape = (): E.Either<unknown, unknown> => E.right('');

const executeCommand = () => TE.right([]);

type RecordEvaluation = (ports: Ports) => (input: unknown) => TE.TaskEither<unknown, void>;

export const recordEvaluation: RecordEvaluation = (ports) => (input) => pipe(
  input,
  validateInputShape,
  TE.fromEither,
  TE.chainW(executeCommand),
  TE.chainTaskK(ports.commitEvents),
);
