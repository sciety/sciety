import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import * as TE from 'fp-ts/TaskEither';
import { DomainEvent, domainEventCodec } from '../domain-events';

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

export const persistEvents = (pool: Pool) => (events: ReadonlyArray<DomainEvent>): TE.TaskEither<never, void> => pipe(
  events,
  T.traverseArray(writeEventToDatabase(pool)),
  T.map(() => undefined),
  TE.rightTask,
);
