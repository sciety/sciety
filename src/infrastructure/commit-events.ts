import * as IO from 'fp-ts/IO';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { DomainEvent, domainEventCodec } from '../domain-events';
import { CommandResult } from '../types/command-result';
import { Logger } from '../shared-ports';

type Dependencies = {
  inMemoryEvents: Array<DomainEvent>,
  dispatchToAllReadModels: (events: ReadonlyArray<DomainEvent>) => void,
  pool: Pool,
  logger: Logger,
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
}: Dependencies): CommitEvents => (events) => pipe(
  events,
  RA.match(
    () => T.of('no-events-created' as CommandResult),
    (es) => pipe(
      es,
      T.traverseArray(flow(
        T.of,
        T.chainFirst(writeEventToDatabase(pool)),
        T.chainFirst((event) => {
          logger('info', 'Event committed', { event });
          return T.of(undefined);
        }),
        T.chainFirstIOK(flow((event) => inMemoryEvents.push(event), IO.of)),
      )),
      T.map(dispatchToAllReadModels),
      T.map(() => 'events-created' as CommandResult),
    ),
  ),
);
