import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { executeCreateListCommand } from './execute-create-list-command';
import { DomainEvent } from '../domain-events';
import { constructCommand } from '../policies/create-user-saved-articles-list-as-generic-list';
import { CommitEvents, Logger } from '../shared-ports';
import { User } from '../types/user';

type Ports = {
  commitEvents: CommitEvents,
  logger: Logger,
};

const determineUsersInNeedOfLists = () => (): ReadonlyArray<User> => [];

const createListEvent = (user: User) => pipe(
  constructCommand({ userId: user.id, handle: user.handle }),
  executeCreateListCommand,
);

type Backfill = (ports: Ports, events: ReadonlyArray<DomainEvent>) => T.Task<void>;

export const backfillListsForUsersWithoutLists: Backfill = (ports, events) => pipe(
  events,
  determineUsersInNeedOfLists(),
  RA.chain(createListEvent),
  (eventsToBeCommitted) => {
    ports.logger('debug', 'backfillListsForUsersWithoutLists', { eventToBeCommitted: eventsToBeCommitted.length });
    return eventsToBeCommitted;
  },
  ports.commitEvents,
  T.map(() => undefined),
);
