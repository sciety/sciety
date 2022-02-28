import * as E from 'fp-ts/Either';
import * as IO from 'fp-ts/IO';
import { JsonRecord } from 'fp-ts/Json';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import { Pool } from 'pg';
import { ListsEvent } from './lists-event';
import { evaluationRecordedEventCodec, listCreatedEventCodec } from '../domain-events';
import * as L from '../infrastructure/logger';

type EventRow = {
  id: string,
  type: string,
  date: string,
  payload: JsonRecord,
};

const listsEventCodec = t.union([
  evaluationRecordedEventCodec,
  listCreatedEventCodec,
], 'type');

const listsEventsCodec = t.readonlyArray(listsEventCodec);

type QueryDatabaseForEventsWithNewerDate = (
  pool: Pool,
  logger: L.LoggerIO,
) => (date: Date) => TE.TaskEither<Error, ReadonlyArray<ListsEvent>>;

export const queryDatabaseForEventsWithNewerDate: QueryDatabaseForEventsWithNewerDate = (
  pool,
  logger,
) => (date) => pipe(
  TE.tryCatch(async () => pool.query<EventRow>(`
      SELECT id, type, date::text, payload 
      FROM events 
      WHERE type = 'ListCreated' OR type = 'EvaluationRecorded'
      AND date > $1
    `,
  [date]), E.toError),
  TE.map((result) => result.rows),
  TE.chainFirstIOK(flow(
    (rows) => ({ count: rows.length }),
    L.debug('Reading NEW events from database'),
    IO.chain(logger),
  )),
  TE.chainEitherK(flow(
    RA.map((row) => ({ ...row, ...row.payload })),
    listsEventsCodec.decode,
    E.mapLeft((errors) => new Error(PR.failure(errors).join('\n'))),
  )),
);
