import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import { UpdateUserDetailsCommand } from '../commands';
import { CommandHandler } from '../../types/command-handler';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { replayUserResource } from '../resources/user-resource';
import { executeCommand } from './execute-command';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type UpdateUserDetailsCommandHandler = (
  adapters: Ports
) => CommandHandler<UpdateUserDetailsCommand>;

export const updateUserDetailsCommandHandler: UpdateUserDetailsCommandHandler = (
  adapters,
) => (command) => pipe(
  adapters.getAllEvents,
  T.map(replayUserResource(command.userId)),
  TE.map(executeCommand(command)),
  TE.chainTaskK(adapters.commitEvents),
);
