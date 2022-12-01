import * as E from 'fp-ts/Either';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { Command, createAppropriateEvents } from './create-appropriate-events';
import { recordEvaluationCommandCodec } from '../commands';
import { validateInputShape } from '../commands/validate-input-shape';
import { DomainEvent } from '../domain-events';
import { CommitEvents, GetGroup } from '../shared-ports';
import { CommandResult } from '../types/command-result';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
  getGroup: GetGroup,
};

const confirmGroupExists = (ports: Ports) => (command: Command) => pipe(
  command.groupId,
  ports.getGroup,
  E.mapLeft(() => `Group "${command.groupId}" not found`),
);

type RecordEvaluationCommandHandler = (ports: Ports) => (input: unknown) => TE.TaskEither<string, CommandResult>;

export const recordEvaluationCommandHandler: RecordEvaluationCommandHandler = (ports) => (input) => pipe(
  input,
  validateInputShape(recordEvaluationCommandCodec),
  E.chainFirstW(confirmGroupExists(ports)),
  TE.fromEither,
  TE.chainTaskK((command) => pipe(
    ports.getAllEvents,
    T.map(createAppropriateEvents(command)),
  )),
  TE.chainTaskK(ports.commitEvents),
);
