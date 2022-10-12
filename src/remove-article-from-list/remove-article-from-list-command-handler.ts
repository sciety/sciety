import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { removeArticleFromListCommandCodec } from '../commands';
import { validateInputShape } from '../commands/validate-input-shape';
import { CommitEvents, GetAllEvents } from '../shared-ports';
import { replayListAggregate } from '../shared-write-models/replay-list-aggregate';
import { CommandResult } from '../types/command-result';

type Ports = {
  getAllEvents: GetAllEvents,
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
