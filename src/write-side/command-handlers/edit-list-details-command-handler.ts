import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as listResource from '../resources/list';
import { EditListDetailsCommand } from '../commands';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandHandler } from '../../types/command-handler';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type EditListDetailsCommandHandler = (
  adapters: Ports
) => CommandHandler<EditListDetailsCommand>;

export const editListDetailsCommandHandler: EditListDetailsCommandHandler = (
  adapters,
) => (
  command,
) => pipe(
  adapters.getAllEvents,
  T.map(listResource.update(command)),
  TE.chainTaskK(adapters.commitEvents),
);
