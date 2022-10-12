import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { addGroupCommandCodec } from '../commands';
import { validateInputShape } from '../commands/validate-input-shape';
import { DomainEvent } from '../domain-events';
import { CommitEvents } from '../shared-ports';
import { CommandResult } from '../types/command-result';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

type AddGroupCommandHandler = (
  ports: Ports
) => (
  input: unknown,
) => TE.TaskEither<string, CommandResult>;

export const addGroupCommandHandler: AddGroupCommandHandler = (
  ports,
) => (
  input,
) => pipe(
  input,
  validateInputShape(addGroupCommandCodec),
  TE.fromEither,
  TE.chainW((command) => pipe(
    ports.getAllEvents,
    T.map(executeCommand(command)),
  )),
  TE.chainTaskK(ports.commitEvents),
);
