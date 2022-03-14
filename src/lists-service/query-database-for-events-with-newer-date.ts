import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, identity, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import { EventRow, listsEventsCodec, selectListsEventsWithNewerDate } from './events-table';
import { ListsEvent } from './lists-event';
import { Logger } from '../infrastructure/logger';
import * as DE from '../types/data-error';

type QueryDatabaseForEventsWithNewerDate = (
  pool: Pool,
  logger: Logger,
) => (date: Date) => TE.TaskEither<DE.DataError, ReadonlyArray<ListsEvent>>;

export const queryDatabaseForEventsWithNewerDate: QueryDatabaseForEventsWithNewerDate = (
  pool,
  logger,
) => (date) => pipe(
  TE.tryCatch(
    async () => pool.query<EventRow>(selectListsEventsWithNewerDate, [date]),
    identity,
  ),
  TE.chainFirstTaskK((result) => T.of(logger('debug', 'Reading NEW events from database', { count: result.rows.length }))),
  TE.map((result) => result.rows),
  TE.chainEitherKW(flow(
    RA.map((row) => ({ ...row, ...row.payload })),
    listsEventsCodec.decode,
  )),
  TE.mapLeft(() => DE.unavailable),
);
