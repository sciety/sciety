import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
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

const writeEventToDatabase = (pool: Pool) => (event: DomainEvent): T.Task<void> => pipe(
  event,
  domainEventCodec.encode,
  ({
    id, type, date, ...payload
  }) => [id, type, date, payload],
  (values) => async () => pool.query(
    'INSERT INTO events (id, type, date, payload) VALUES ($1, $2, $3, $4);',
    values,
  ),
  T.map(() => undefined),
);

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
  await pipe(
    events,
    T.traverseArray(flow(
      T.of,
      T.chainFirst(writeEventToDatabase(pool)),
      T.chainFirst((event) => {
        logger('info', 'Event committed', { event });
        return T.of(undefined);
      }),
    )),
  )();
  inMemoryEvents.push(...events);
  dispatchToAllReadModels(events);
  return 'events-created' as CommandResult;
};
