import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { executeCreateListCommand } from './execute-create-list-command';
import { DomainEvent, isUserCreatedAccountEvent } from '../domain-events';
import { constructCommand } from '../policies/create-user-saved-articles-list-as-generic-list';
import { CommitEvents, Logger, SelectAllListsOwnedBy } from '../shared-ports';
import * as LOID from '../types/list-owner-id';
import { User } from '../types/user';

type Queries = {
  selectAllListsOwnedBy: SelectAllListsOwnedBy,
};

type Ports = {
  commitEvents: CommitEvents,
  logger: Logger,
} & Queries;

type DetermineUsersInNeedOfLists = (ports: Queries) => (events: ReadonlyArray<DomainEvent>) => ReadonlyArray<User>;

// ts-unused-exports:disable-next-line
export const determineUsersInNeedOfLists: DetermineUsersInNeedOfLists = (ports) => (events) => pipe(
  events,
  RA.filter(isUserCreatedAccountEvent),
  RA.filter((event) => ports.selectAllListsOwnedBy(LOID.fromUserId(event.userId)).length === 0),
  RA.map((event) => ({
    id: event.userId,
    handle: event.handle,
    avatarUrl: event.avatarUrl,
  })),
  () => [],
);

const createListEvent = (user: User) => pipe(
  constructCommand({ userId: user.id, handle: user.handle }),
  executeCreateListCommand,
);

type Backfill = (ports: Ports, events: ReadonlyArray<DomainEvent>) => T.Task<void>;

export const backfillListsForUsersWithoutLists: Backfill = (ports, events) => pipe(
  events,
  determineUsersInNeedOfLists(ports),
  RA.chain(createListEvent),
  (eventsToBeCommitted) => {
    ports.logger('debug', 'backfillListsForUsersWithoutLists', { eventToBeCommitted: eventsToBeCommitted.length });
    return eventsToBeCommitted;
  },
  ports.commitEvents,
  T.map(() => undefined),
);
