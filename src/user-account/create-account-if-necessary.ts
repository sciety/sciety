import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { CreateUserAccountCommand } from '../write-side/commands/create-user-account';
import { setUpUserIfNecessary } from './set-up-user-if-necessary';
import { DomainEvent } from '../domain-events';
import { CommitEvents } from '../shared-ports';
import { CommandResult } from '../types/command-result';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type CreateAccountIfNecessary = (ports: Ports) => (command: CreateUserAccountCommand) => T.Task<CommandResult>;

export const createAccountIfNecessary: CreateAccountIfNecessary = (ports) => (command) => pipe(
  ports.getAllEvents,
  T.map(setUpUserIfNecessary(command)),
  T.chain(ports.commitEvents),
);
