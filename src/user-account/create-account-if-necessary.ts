import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import { CreateUserAccountCommand } from '../write-side/commands/create-user-account';
import { setUpUserIfNecessary } from './set-up-user-if-necessary';
import { DomainEvent, isUserCreatedAccountEvent } from '../domain-events';
import { CommitEvents } from '../shared-ports';
import { CommandHandler } from '../types/command-handler';
import { toErrorMessage } from '../types/error-message';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

export type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

// ts-unused-exports:disable-next-line
export const checkCommand = (command: CreateUserAccountCommand) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isUserCreatedAccountEvent),
  RA.map((event) => event.handle),
  RA.filter((handle) => handle === command.handle),
  RA.match(
    () => E.right(command),
    () => E.left(toErrorMessage('handle-already-exists')),
  ),
);

type CreateAccountIfNecessary = (ports: Ports) => CommandHandler<CreateUserAccountCommand>;

export const createAccountIfNecessary: CreateAccountIfNecessary = (ports) => (command) => pipe(
  ports.getAllEvents,
  T.map(checkCommand(command)),
  TE.chainTaskK(() => pipe(
    ports.getAllEvents,
    T.map(setUpUserIfNecessary(command)),
    T.chain(ports.commitEvents),
  )),
);
