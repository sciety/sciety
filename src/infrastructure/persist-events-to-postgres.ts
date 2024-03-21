import { pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import * as TE from 'fp-ts/TaskEither';
import { DomainEvent, domainEventCodec } from '../domain-events';
import { ErrorMessage, toErrorMessage } from '../types/error-message';

const encodeEvent = (event: DomainEvent) => pipe(
  event,
  domainEventCodec.encode,
  ({
    id, type, date, ...payload
  }) => [id, type, date, payload],
);

const writeEventToDatabase = (pool: Pool) => (event: DomainEvent) => TE.tryCatch(
  async () => pool.query(
    'INSERT INTO events (id, type, date, payload) VALUES ($1, $2, $3, $4);',
    encodeEvent(event),
  ),
  () => toErrorMessage('Failed to write an event to the database'),
);

export const persistEventsToPostgres = (
  pool: Pool,
) => (
  events: ReadonlyArray<DomainEvent>,
): TE.TaskEither<ErrorMessage, void> => pipe(
  events,
  TE.traverseArray(writeEventToDatabase(pool)),
  TE.map(() => undefined),
);
