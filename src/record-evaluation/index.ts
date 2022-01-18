import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { validateInputShape } from './validate-input-shape';
import { DomainEvent, RuntimeGeneratedEvent } from '../domain-events';
import { CommandResult } from '../types/command-result';

type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

type RecordEvaluation = (ports: Ports) => (input: unknown) => TE.TaskEither<string, CommandResult>;

export const recordEvaluation: RecordEvaluation = (ports) => (input) => pipe(
  input,
  validateInputShape,
  TE.fromEither,
  TE.chainW((command) => pipe(
    ports.getAllEvents,
    T.map(executeCommand(command)),
  )),
  TE.chainFirstW(flow(ports.commitEvents, TE.rightTask)),
  TE.map(RA.match(
    () => 'no-events-created',
    () => 'events-created',
  )),
);
