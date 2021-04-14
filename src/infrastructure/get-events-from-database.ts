import * as E from 'fp-ts/Either';
import * as IO from 'fp-ts/IO';
import { JsonRecord } from 'fp-ts/Json';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as PR from 'io-ts/PathReporter';
import { Pool } from 'pg';
import * as L from './logger';
import { domainEvents } from '../types/codecs/DomainEvent';
import { RuntimeGeneratedEvent } from '../types/domain-events';

type EventRow = {
  id: string,
  type: string,
  date: string,
  payload: JsonRecord,
};

export const getEventsFromDatabase = (
  pool: Pool,
  logger: L.LoggerIO,
): TE.TaskEither<Error, ReadonlyArray<RuntimeGeneratedEvent>> => pipe(
  TE.tryCatch(async () => pool.query<EventRow>('SELECT id, type, date::text, payload FROM events'), E.toError),
  TE.map((result) => result.rows),
  TE.chainFirstIOK(flow(
    (rows) => ({ count: rows.length }),
    L.debug('Reading events from database'),
    IO.chain(logger),
  )),
  TE.chainEitherK(flow(
    RA.map((row) => ({ ...row, ...row.payload })),
    domainEvents.decode,
    E.mapLeft((errors) => new Error(PR.failure(errors).join('\n'))),
  )),
);
