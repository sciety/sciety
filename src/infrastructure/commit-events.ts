import * as IO from 'fp-ts/IO';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import * as L from './logger';
import { DomainEvent } from '../domain-events';
import { domainEventCodec } from '../types/codecs/DomainEvent';
import { CommandResult } from '../types/command-result';

type Dependencies = {
  inMemoryEvents: Array<DomainEvent>,
  pool: Pool,
  logger: L.Logger,
};

export const writeEventToDatabase = (pool: Pool) => (event: DomainEvent): T.Task<void> => pipe(
  event,
  domainEventCodec.encode,
  ({
    id, type, date, ...payload
  }) => [id, type, date, payload],
  (values) => async () => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        'INSERT INTO events (id, type, date, payload) VALUES ($1, $2, $3, $4);',
        values,
      );
      await client.query('COMMIT');
    } catch (e: unknown) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  },
  T.map(() => undefined),
);

type CommitEvents = (event: ReadonlyArray<DomainEvent>) => T.Task<CommandResult>;

export const commitEvents = ({ inMemoryEvents, pool, logger }: Dependencies): CommitEvents => (events) => pipe(
  events,
  T.traverseArray(flow(
    T.of,
    T.chainFirst(writeEventToDatabase(pool)),
    T.chainFirst((event) => {
      logger('info', 'Event committed', { event });
      return T.of(undefined);
    }),
    T.chainFirstIOK(flow((event) => inMemoryEvents.push(event), IO.of)),
  )),
  T.map(RA.match(
    () => 'no-events-created',
    () => 'events-created',
  )),
);
