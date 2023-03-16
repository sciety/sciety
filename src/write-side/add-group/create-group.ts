import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { executeCommand } from './execute-command';
import { AddGroupCommand } from '../commands';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandResult } from '../../types/command-result';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

// ts-unused-exports:disable-next-line
export const createGroup = (
  adapters: Ports,
) => (command: AddGroupCommand): TE.TaskEither<string, CommandResult> => pipe(
  adapters.getAllEvents,
  T.map(executeCommand(command)),
  TE.chainTaskK(adapters.commitEvents),
);
