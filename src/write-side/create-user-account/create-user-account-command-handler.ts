import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { CreateUserAccountCommand } from '../commands/create-user-account';
import { setUpUserIfNecessary } from './set-up-user-if-necessary';
import { DomainEvent } from '../../domain-events';
import { CommitEvents } from '../../shared-ports';
import { CommandHandler } from '../../types/command-handler';
import { checkCommand } from './check-command';
import { ResourceAction } from '../resources/resource-action';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

const executeCommand: ResourceAction<CreateUserAccountCommand> = (command) => (events) => pipe(
  events,
  checkCommand(command),
  E.map(() => pipe(
    events,
    setUpUserIfNecessary(command),
  )),
);

type CreateUserAccountCommandHandler = (ports: Ports) => CommandHandler<CreateUserAccountCommand>;

export const createUserAccountCommandHandler: CreateUserAccountCommandHandler = (ports) => (command) => pipe(
  ports.getAllEvents,
  T.map(executeCommand(command)),
  TE.chainTaskK(ports.commitEvents),
);
