import * as TE from 'fp-ts/TaskEither';
import { EditUserDetailsCommand } from '../commands';
import { toErrorMessage } from '../../types/error-message';
import { CommandHandler } from '../../types/command-handler';
import { CommitEvents, GetAllEvents } from '../../shared-ports';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type EditUserDetailsCommandHandler = (
  adapters: Ports
) => CommandHandler<EditUserDetailsCommand>;

export const editUserDetailsCommandHandler: EditUserDetailsCommandHandler = (

) => (

) => TE.left(toErrorMessage('no-events-raised'));
