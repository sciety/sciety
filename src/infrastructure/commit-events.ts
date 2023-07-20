import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import * as L from './logger';
import { DomainEvent, domainEventCodec } from '../domain-events';
import { CommandResult } from '../types/command-result';

type Dependencies = {
  inMemoryEvents: Array<DomainEvent>,
  dispatchToAllReadModels: (events: ReadonlyArray<DomainEvent>) => void,
  pool: Pool,
  logger: L.Logger,
};

const encodeEvent = (event: DomainEvent) => pipe(
  event,
  domainEventCodec.encode,
  ({
    id, type, date, ...payload
  }) => [id, type, date, payload],
);

const writeEventToDatabase = (pool: Pool) => (event: DomainEvent) => async () => pool.query(
  'INSERT INTO events (id, type, date, payload) VALUES ($1, $2, $3, $4);',
  encodeEvent(event),
);

const persistEvents = (pool: Pool) => async (events: ReadonlyArray<DomainEvent>): Promise<void> => pipe(
  events,
  T.traverseArray(writeEventToDatabase(pool)),
  T.map(() => undefined),
)();

type CommitEvents = (event: ReadonlyArray<DomainEvent>) => T.Task<CommandResult>;

export const commitEvents = ({
  inMemoryEvents,
  dispatchToAllReadModels,
  pool,
  logger,
}: Dependencies): CommitEvents => (events) => async () => {
  if (events.length === 0) {
    return 'no-events-created' as CommandResult;
  }
  await persistEvents(pool)(events);
  inMemoryEvents.push(...events);
  dispatchToAllReadModels(events);
  logger('info', 'Events committed', { events });
  return 'events-created' as CommandResult;
};
