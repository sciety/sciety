import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Pool } from 'pg';
import { EventRow, listsEventsCodec, selectListsEventsWithNewerDate } from './events-table';
import { ListsEvent } from './lists-event';
import { Logger } from '../infrastructure/logger';

type QueryDatabaseForEventsWithNewerDate = (
  pool: Pool,
  logger: Logger,
) => (date: Date) => TE.TaskEither<Error, ReadonlyArray<ListsEvent>>;

export const queryDatabaseForEventsWithNewerDate: QueryDatabaseForEventsWithNewerDate = (
  pool,
  logger,
) => (date) => pipe(
  TE.tryCatch(async () => pool.query<EventRow>(selectListsEventsWithNewerDate, [date]), E.toError),
  TE.chainFirstTaskK((result) => T.of(logger('debug', 'Reading NEW events from database', { count: result.rows.length }))),
  TE.map((result) => result.rows),
  TE.chainEitherK(flow(
    RA.map((row) => ({ ...row, ...row.payload })),
    listsEventsCodec.decode,
    E.mapLeft((errors) => new Error(PR.failure(errors).join('\n'))),
  )),
);
