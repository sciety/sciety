import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import { UpdateUserDetailsCommand } from '../commands';
import { CommandHandler } from '../../types/command-handler';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { update } from '../resources/user/update';

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
  TE.chainEitherKW(update(command)),
  TE.chainTaskK(adapters.commitEvents),
);
