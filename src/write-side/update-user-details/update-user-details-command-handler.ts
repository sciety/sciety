import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import { UpdateUserDetailsCommand } from '../commands';
import { CommandHandler } from '../../types/command-handler';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { DomainEvent } from '../../domain-events';
import { replayUserResource, UserResource } from '../resources/user-resource';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type ExecuteCommand = (command: UpdateUserDetailsCommand)
=> (userResource: UserResource)
=> ReadonlyArray<DomainEvent>;

// ts-unused-exports:disable-next-line
export const executeCommand: ExecuteCommand = () => () => [];

type UpdateUserDetailsCommandHandler = (
  adapters: Ports
) => CommandHandler<UpdateUserDetailsCommand>;

export const updateUserDetailsCommandHandler: UpdateUserDetailsCommandHandler = (
  adapters,
) => (command) => pipe(
  adapters.getAllEvents,
  T.map(replayUserResource(command.id)),
  TE.map(executeCommand(command)),
  TE.chainTaskK(adapters.commitEvents),
);
