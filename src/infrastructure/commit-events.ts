import * as IO from 'fp-ts/IO';
import * as T from 'fp-ts/Task';
import { constVoid, flow, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import * as L from './logger';
import { DomainEvent, RuntimeGeneratedEvent } from '../domain-events';
import { domainEvent } from '../types/codecs/DomainEvent';

type Dependencies = {
  inMemoryEvents: Array<DomainEvent>,
  pool: Pool,
  logger: L.LoggerIO,
};

// TODO: should return a TaskEither
type CommitEvents = (dependencies: Dependencies) => (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<void>;

export const commitEvents: CommitEvents = ({ inMemoryEvents, pool, logger }) => (events) => pipe(
  events,
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
    T.chainFirstIOK(flow(
      (event) => ({ event }),
      L.info('Event committed'),
      IO.chain(logger),
    )),
    T.chainFirstIOK(flow((event) => inMemoryEvents.push(event), IO.of)),
  )),
  T.map(constVoid),
);
