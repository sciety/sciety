import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { validateInputShape } from './validate-input-shape';
import { removeArticleFromListCommandCodec } from '../commands';
import { DomainEvent } from '../domain-events';
import { CommitEvents } from '../shared-ports';
import { replayListAggregate } from '../shared-write-models/replay-list-aggregate';
import { CommandResult } from '../types/command-result';

type Ports = {
  getAllEvents: T.Task<ReadonlyArray<DomainEvent>>,
  commitEvents: CommitEvents,
};

type RemoveArticleFromListCommandHandler = (
  ports: Ports
) => (
  input: unknown,
  date?: Date
) => TE.TaskEither<string, CommandResult>;

export const removeArticleFromListCommandHandler: RemoveArticleFromListCommandHandler = (
  ports,
) => (
  input,
  date = new Date(),
) => pipe(
  input,
  validateInputShape(removeArticleFromListCommandCodec),
  TE.fromEither,
  TE.chainW((command) => pipe(
    ports.getAllEvents,
    TE.rightTask,
    TE.chainEitherK(replayListAggregate(command.listId)),
    TE.map(executeCommand(command, date)),
  )),
  TE.chainTaskK(ports.commitEvents),
);
