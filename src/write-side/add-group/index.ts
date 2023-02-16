import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { addGroupCommandCodec } from '../commands';
import { validateInputShape } from '../commands/validate-input-shape';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandResult } from '../../types/command-result';
import * as GID from '../../types/group-id';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type AddGroupCommandHandler = (
  adapters: Ports
) => (
  input: unknown,
) => TE.TaskEither<string, CommandResult>;

export const addGroupCommandHandler: AddGroupCommandHandler = (
  adapters,
) => (
  input,
) => pipe(
  {
    ...input as object,
    id: GID.generate(),
  },
  validateInputShape(addGroupCommandCodec),
  TE.fromEither,
  TE.chainW((command) => pipe(
    adapters.getAllEvents,
    T.map(executeCommand(command)),
  )),
  TE.chainTaskK(adapters.commitEvents),
);
