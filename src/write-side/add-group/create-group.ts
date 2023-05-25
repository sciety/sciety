import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { create } from '../resources/group';
import { AddGroupCommand } from '../commands';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { CommandHandler } from '../../types/command-handler';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type CreateGroup = (adapters: Ports) => CommandHandler<AddGroupCommand>;

// ts-unused-exports:disable-next-line
export const createGroup: CreateGroup = (adapters) => (command) => pipe(
  adapters.getAllEvents,
  T.map(create(command)),
  TE.chainTaskK(adapters.commitEvents),
);
