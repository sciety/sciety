import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';
import { UpdateUserDetailsCommand } from '../commands';
import { CommandHandler } from '../../types/command-handler';
import { CommitEvents, GetAllEvents } from '../../shared-ports';
import { DomainEvent } from '../../domain-events';
import { ErrorMessage } from '../../types/error-message';
import { UserId } from '../../types/user-id';

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type UserResource = unknown;

type ReplayUserResource = (userId: UserId)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, UserResource>;

const replayUserResource: ReplayUserResource = () => () => E.left('nope' as ErrorMessage);

type ExecuteCommand = (command: UpdateUserDetailsCommand)
=> (userResource: UserResource)
=> ReadonlyArray<DomainEvent>;

const executeCommand: ExecuteCommand = () => () => [];

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
