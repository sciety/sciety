import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { constVoid, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { Logger } from './logger';
import { domainEvent } from '../types/codecs/DomainEvent';
import { DomainEvent, RuntimeGeneratedEvent } from '../types/domain-events';

// TODO: should return a TaskEither
export type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

export const commitEvents = (
  inMemoryEvents: Array<DomainEvent>,
  pool: Pool,
  logger: Logger,
): CommitEvents => (
  (events) => pipe(
    events,
    RA.map((event) => async () => {
      const {
        id, type, date, ...payload
      } = domainEvent.encode(event);
      await pool.query(
        'INSERT INTO events (id, type, date, payload) VALUES ($1, $2, $3, $4);',
        [id, type, date, payload],
      );

      inMemoryEvents.push(event);

      logger('info', 'Event committed', { event });
    }),
    T.sequenceArray,
    T.map(constVoid),
  )
);
