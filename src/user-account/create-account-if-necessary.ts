import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CreateUserAccountCommand } from '../write-side/commands/create-user-account';
import { setUpUserIfNecessary } from './set-up-user-if-necessary';
import { DomainEvent } from '../domain-events';
import { CommitEvents } from '../shared-ports';
import { CommandHandler } from '../types/command-handler';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type CreateAccountIfNecessary = (ports: Ports) => CommandHandler<CreateUserAccountCommand>;

export const createAccountIfNecessary: CreateAccountIfNecessary = (ports) => (command) => pipe(
  ports.getAllEvents,
  T.map(setUpUserIfNecessary(command)),
  T.chain(ports.commitEvents),
  TE.rightTask,
);
