import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { replayAggregate } from './replay-aggregate';
import { validateInputShape } from './validate-input-shape';
import { DomainEvent } from '../domain-events';
import { CommitEvents } from '../shared-ports';
import { CommandResult } from '../types/command-result';

export type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

type AddArticleToListCommandHandler = (
  ports: Ports
) => (
  input: unknown,
  date?: Date
) => TE.TaskEither<string, CommandResult>;

export const addArticleToListCommandHandler: AddArticleToListCommandHandler = (
  ports,
) => (
  input,
  date = new Date(),
) => pipe(
  input,
  validateInputShape,
  TE.fromEither,
  TE.chainW((command) => pipe(
    ports.getAllEvents,
    TE.rightTask,
    TE.chainEitherK(replayAggregate(command.listId)),
    TE.chainEitherK(executeCommand(command, date)),
  )),
  TE.chainTaskK(ports.commitEvents),
);
