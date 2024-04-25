import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { formatValidationErrors } from 'io-ts-reporters';
import { Pool } from 'pg';
import { EventRow, currentOrLegacyDomainEventsCodec, selectAllEvents } from './events-table';
import { upgradeLegacyEventIfNecessary } from './upgrade-legacy-event-if-necessary';
import { DomainEvent } from '../domain-events';
import { Logger } from '../shared-ports';

const waitForTableToExist = async (pool: Pool, logger: Logger) => {
  logger('debug', 'Waiting for events table to exist');
  // eslint-disable-next-line no-loops/no-loops, no-constant-condition
  while (true) {
    const queryResult = await pool.query<{ exists: boolean }>(`
      SELECT EXISTS (
        SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'events'
      )
    `);
    if (queryResult.rows[0].exists) {
      break;
    }
    await T.delay(1000)(T.of(''))();
  }
};

const decodeEvents = (
  rows: ReadonlyArray<EventRow>,
): E.Either<ReadonlyArray<string>, ReadonlyArray<DomainEvent>> => pipe(
  rows,
  RA.map((row) => ({
    id: row.id,
    type: row.type,
    date: row.date,
    ...row.payload,
  })),
  flow(
    currentOrLegacyDomainEventsCodec.decode,
    E.mapLeft(formatValidationErrors),
  ),
  E.map(RA.map(upgradeLegacyEventIfNecessary)),
);

export const getEventsFromDatabase = (
  pool: Pool,
  logger: Logger,
): TE.TaskEither<unknown, ReadonlyArray<DomainEvent>> => pipe(
  TE.tryCatch(async () => {
    await waitForTableToExist(pool, logger);
    return pool.query<EventRow>(selectAllEvents);
  }, flow(E.toError, (e) => [e.message])),
  TE.map((result) => result.rows),
  TE.chainFirstTaskK((rows) => T.of(logger('debug', 'Successfully retrieved rows from database', { count: rows.length }))),
  TE.chainEitherK(decodeEvents),
  TE.chainFirstTaskK((rows) => T.of(logger('debug', 'Successfully decoded events from database', { count: rows.length }))),
);
