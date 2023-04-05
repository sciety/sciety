import * as TE from 'fp-ts/TaskEither';
import { UpdateUserDetailsCommand } from '../commands';
import { CommandHandler } from '../../types/command-handler';
import { CommitEvents, GetAllEvents } from '../../shared-ports';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type UpdateUserDetailsCommandHandler = (
  adapters: Ports
) => CommandHandler<UpdateUserDetailsCommand>;

export const updateUserDetailsCommandHandler: UpdateUserDetailsCommandHandler = (

) => (

) => TE.right('no-events-created');
