import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Pool } from 'pg';
import { EventRow, listsEventsCodec, selectAllListsEvents } from './events-table';
import { ListsEvent } from './lists-event';
import { Logger } from '../infrastructure/logger';

export const getListsEventsFromDatabase = (
  pool: Pool,
  logger: Logger,
): TE.TaskEither<Error, ReadonlyArray<ListsEvent>> => pipe(
  TE.tryCatch(async () => {
    logger('debug', 'Waiting for events table to exist');
    // eslint-disable-next-line no-loops/no-loops, no-constant-condition
    while (true) {
      const queryResult = await pool.query<{ exists: boolean }>('SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = \'public\' AND tablename = \'events\')');
      if (queryResult.rows[0].exists) {
        break;
      }
      await T.delay(1000)(T.of(''))();
    }
    return pool.query<EventRow>(selectAllListsEvents);
  }, E.toError),
  TE.chainFirstTaskK((result) => T.of(logger('debug', 'Reading events from database', { count: result.rows.length }))),
  TE.map((result) => result.rows),
  TE.chainEitherK(flow(
    RA.map((row) => ({ ...row, ...row.payload })),
    listsEventsCodec.decode,
    E.mapLeft((errors) => new Error(PR.failure(errors).join('\n'))),
  )),
);
