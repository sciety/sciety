import * as E from 'fp-ts/Either';
import * as IO from 'fp-ts/IO';
import { JsonRecord } from 'fp-ts/Json';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import * as PR from 'io-ts/PathReporter';
import { Pool } from 'pg';
import * as L from './logger';
import { RuntimeGeneratedEvent } from '../domain-events';
import { domainEventCodec } from '../types/codecs/DomainEvent';

type EventRow = {
  id: string,
  type: string,
  date: string,
  payload: JsonRecord,
};

const domainEventsCodec = t.readonlyArray(domainEventCodec);

export const getEventsFromDatabase = (
  pool: Pool,
  logger: L.LoggerIO,
): TE.TaskEither<Error, ReadonlyArray<RuntimeGeneratedEvent>> => pipe(
  TE.tryCatch(async () => {
    pipe(
      {},
      L.debug('Waiting for events table to exist'),
      IO.chain(logger),
    )();
    // eslint-disable-next-line no-loops/no-loops
    while (true) {
      const queryResult = await pool.query<{ exists: boolean }>('SELECT EXISTS (SELECT FROM pg_tables WHERE schemaname = \'public\' AND tablename = \'events\')');
      if (queryResult.rows[0].exists) {
        break;
      }
      await T.delay(1000)(T.of(''))();
    }
    return pool.query<EventRow>('SELECT id, type, date::text, payload FROM events');
  }, E.toError),
  TE.map((result) => result.rows),
  TE.chainFirstIOK(flow(
    (rows) => ({ count: rows.length }),
    L.debug('Reading events from database'),
    IO.chain(logger),
  )),
  TE.chainEitherK(flow(
    RA.map((row) => ({ ...row, ...row.payload })),
    domainEventsCodec.decode,
    E.mapLeft((errors) => new Error(PR.failure(errors).join('\n'))),
  )),
);
