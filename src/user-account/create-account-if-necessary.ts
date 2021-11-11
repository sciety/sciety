import * as T from 'fp-ts/Task';
import { DomainEvent, RuntimeGeneratedEvent } from '../domain-events';
import { UserId } from '../types/user-id';

type GetAllEvents = T.Task<ReadonlyArray<DomainEvent>>;

type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

type Ports = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

// ts-unused-exports:disable-next-line
export type UserAccount = {
  id: UserId,
  handle: string,
  avatarUrl: string,
  displayName: string,
};

type CreateAccountIfNecessary = (ports: Ports) => (userAccount: UserAccount) => T.Task<void>;

export const createAccountIfNecessary: CreateAccountIfNecessary = ({ commitEvents }) => () => (
  commitEvents([])
);
