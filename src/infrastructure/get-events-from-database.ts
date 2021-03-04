import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as TE from 'fp-ts/TaskEither';
import { flow, pipe } from 'fp-ts/function';
import { JsonRecord } from 'io-ts-types';
import * as PR from 'io-ts/PathReporter';
import { Pool } from 'pg';
import { Logger } from './logger';
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
  logger: Logger,
): TE.TaskEither<Error, ReadonlyArray<RuntimeGeneratedEvent>> => pipe(
  TE.tryCatch(async () => pool.query<EventRow>('SELECT id, type, date::text, payload FROM events'), E.toError),
  TE.map((result) => result.rows),
  TE.chainFirstW(flow(
    (rows) => logger('debug', 'Reading events from database', { count: rows.length }),
    TE.right,
  )),
  TE.map(RA.map((row) => ({ ...row, ...row.payload }))),
  TE.chain(flow(
    domainEvents.decode,
    TE.fromEither,
    TE.mapLeft((errors) => new Error(PR.failure(errors).join('\n'))),
  )),
);
