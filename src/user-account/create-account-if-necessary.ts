import * as T from 'fp-ts/Task';
import { DomainEvent, RuntimeGeneratedEvent } from '../domain-events';
import { User } from '../types/user';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

type CreateAccountIfNecessary = (ports: Ports) => (user: User) => T.Task<void>;

export const createAccountIfNecessary: CreateAccountIfNecessary = ({ commitEvents }) => () => (
  commitEvents([])
);
