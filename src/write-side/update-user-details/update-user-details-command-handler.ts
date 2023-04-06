import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { UpdateUserDetailsCommand } from '../commands';
import { CommandHandler } from '../../types/command-handler';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { replayUserResource } from '../resources/user-resource';
import { executeCommand } from './execute-command';
import { DomainEvent } from '../../domain-events';
import { ErrorMessage } from '../../types/error-message';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type UpdateUserDetailsResourceAction = (command: UpdateUserDetailsCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ReadonlyArray<DomainEvent>>;

const updateUserDetailsResourceAction: UpdateUserDetailsResourceAction = (command) => (events) => pipe(
  events,
  replayUserResource(command.userId),
  E.map(executeCommand(command)),
);

type UpdateUserDetailsCommandHandler = (
  adapters: Ports
) => CommandHandler<UpdateUserDetailsCommand>;

export const updateUserDetailsCommandHandler: UpdateUserDetailsCommandHandler = (
  adapters,
) => (command) => pipe(
  adapters.getAllEvents,
  TE.rightTask,
  TE.chainEitherKW(updateUserDetailsResourceAction(command)),
  TE.chainTaskK(adapters.commitEvents),
);
