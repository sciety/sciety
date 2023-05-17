import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CommandHandler } from '../../types/command-handler';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { UpdateGroupDetailsCommand } from '../commands';
import * as groupResource from '../resources/group';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type UpdateGroupDetailsCommandHandler = (
  adapters: Ports
) => CommandHandler<UpdateGroupDetailsCommand>;

export const updateGroupDetailsCommandHandler: UpdateGroupDetailsCommandHandler = (
  adapters,
) => (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  command,
) => pipe(
  adapters.getAllEvents,
  TE.rightTask,
  TE.chainEitherKW(groupResource.update(command)),
  TE.chainTaskK(adapters.commitEvents),
);
