import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { Json } from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { Pool } from 'pg';
import { databaseEvents } from './codecs/DatabaseEvent';
import { Logger } from './logger';
import { DomainEvent, RuntimeGeneratedEvent } from '../types/domain-events';
import { EventId } from '../types/event-id';

type EventRow = {
  id: EventId,
  type: string,
  date: Date,
  payload: Json,
};

export const getEventsFromDatabase = (
  pool: Pool,
  logger: Logger,
): TE.TaskEither<Error, ReadonlyArray<DomainEvent>> => pipe(
  TE.tryCatch(async () => pool.query<EventRow>('SELECT * FROM events'), E.toError),
  TE.map((result) => result.rows),
  TE.chainFirstW(flow(
    (rows) => logger('debug', 'Reading events from database', { count: rows.length }),
    TE.right,
  )),
  TE.map(
    // TODO return a string from the database
    RA.map((row) => ({ ...row, date: row.date.toString() })),
  ),
  TE.chain(flow(
    databaseEvents.decode,
    TE.fromEither,
    TE.mapLeft((errors) => new Error(PR.failure(errors).join('\n'))),
  )),
  TE.map(
    // TODO TypeScript can't flatten the type of the union of objects correctly
    RA.map((event) => ({ ...event, ...event.payload }) as RuntimeGeneratedEvent),
  ),
);
