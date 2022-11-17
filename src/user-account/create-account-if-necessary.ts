import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { setUpUserIfNecessary, UserAccount } from './set-up-user-if-necessary';
import { DomainEvent } from '../domain-events';
import { CommitEvents } from '../shared-ports';
import { CommandResult } from '../types/command-result';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type CreateAccountIfNecessary = (ports: Ports) => (userAccount: UserAccount) => T.Task<CommandResult>;

export const createAccountIfNecessary: CreateAccountIfNecessary = (ports) => (user) => pipe(
  ports.getAllEvents,
  T.map(setUpUserIfNecessary(user)),
  T.chain(ports.commitEvents),
);
