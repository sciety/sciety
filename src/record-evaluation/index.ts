import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Command, executeCommand } from './execute-command';
import { DomainEvent, RuntimeGeneratedEvent } from '../domain-events';
import * as GID from '../types/group-id';

type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

const validateInputShape = (): E.Either<unknown, Command> => E.right({
  groupId: GID.fromValidatedString(''),
});

type RecordEvaluation = (ports: Ports) => (input: unknown) => TE.TaskEither<unknown, void>;

export const recordEvaluation: RecordEvaluation = (ports) => (input) => pipe(
  input,
  validateInputShape,
  TE.fromEither,
  TE.chainW((command) => pipe(
    ports.getAllEvents,
    T.map(executeCommand(command)),
  )),
  TE.chainTaskK(ports.commitEvents),
);
