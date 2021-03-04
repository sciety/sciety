import * as IO from 'fp-ts/IO';
import * as T from 'fp-ts/Task';
import { constVoid, flow } from 'fp-ts/function';
import { Pool } from 'pg';
import * as L from './logger';
import { domainEvent } from '../types/codecs/DomainEvent';
import { DomainEvent, RuntimeGeneratedEvent } from '../types/domain-events';

// TODO: should return a TaskEither
export type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

export const commitEvents = (
  inMemoryEvents: Array<DomainEvent>,
  pool: Pool,
  logger: L.LoggerIO,
): CommitEvents => flow(
  T.traverseArray(flow(
    T.of,
    T.chainFirst(flow(
      domainEvent.encode,
      ({
        id, type, date, ...payload
      }) => [id, type, date, payload],
      (values) => async () => pool.query(
        'INSERT INTO events (id, type, date, payload) VALUES ($1, $2, $3, $4);',
        values,
      ),
    )),
    T.chainFirst(flow(
      (event) => ({ event }),
      L.info('Event committed'),
      IO.chain(logger),
      T.fromIO,
    )),
    T.chainFirst(flow((event) => inMemoryEvents.push(event), T.of)),
  )),
  T.map(constVoid),
);
