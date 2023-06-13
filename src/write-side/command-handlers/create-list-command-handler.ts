import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as listResource from '../resources/list';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandHandler } from '../../types/command-handler';
import { CreateListCommand } from '../commands';

type Ports = {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
};

type CreateListCommandHandler = (
  adapters: Ports
) => CommandHandler<CreateListCommand>;

export const createListCommandHandler: CreateListCommandHandler = (
  ports,
) => (
  command,
) => pipe(
  ports.getAllEvents,
  T.map(listResource.create(command)),
  TE.chainTaskK(ports.commitEvents),
);
