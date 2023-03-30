import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { DomainEvent, domainEventCodec } from '../domain-events';

export const writeEventToDatabase = (pool: Pool) => (event: DomainEvent): T.Task<void> => pipe(
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
