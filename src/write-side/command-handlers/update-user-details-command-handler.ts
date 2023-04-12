import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { UpdateUserDetailsCommand } from '../commands';
import { CommandHandler } from '../../types/command-handler';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import * as userResource from '../resources/user';

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
  TE.rightTask,
  TE.chainEitherKW(userResource.update(command)),
  TE.chainTaskK(adapters.commitEvents),
);
