import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Pool } from 'pg';
import { domainEventsCodec, EventRow, selectAllEvents } from './events-table';
import { Logger } from './logger';
import { DomainEvent, isEventOfType } from '../domain-events';

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

const upgradeEventIfNecessary = (event: DomainEvent) => {
  if (isEventOfType('EvaluationRecorded')(event)) {
    return {
      ...event,
      type: 'EvaluationPublicationRecorded' as const,
    };
  }
  return event;
};

const decodeEvents = (rows: ReadonlyArray<EventRow>) => pipe(
  rows,
  RA.map((row) => ({
    id: row.id,
    type: row.type,
    date: row.date,
    ...row.payload,
  })),
  domainEventsCodec.decode,
  E.bimap(
    (errors) => new Error(PR.failure(errors).join('\n')),
    RA.map(upgradeEventIfNecessary),
  ),
);

export const getEventsFromDatabase = (
  pool: Pool,
  logger: Logger,
): TE.TaskEither<Error, ReadonlyArray<DomainEvent>> => pipe(
  TE.tryCatch(async () => {
    await waitForTableToExist(pool, logger);
    return pool.query<EventRow>(selectAllEvents);
  }, E.toError),
  TE.map((result) => result.rows),
  TE.chainFirstTaskK((rows) => T.of(logger('debug', 'Successfully retrieved rows from database', { count: rows.length }))),
  TE.chainEitherK(decodeEvents),
  TE.chainFirstTaskK((rows) => T.of(logger('debug', 'Successfully decoded events from database', { count: rows.length }))),
);
