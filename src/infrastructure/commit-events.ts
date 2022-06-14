import * as IO from 'fp-ts/IO';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import * as L from './logger';
import { DomainEvent, RuntimeGeneratedEvent } from '../domain-events';
import { Logger } from '../shared-ports';
import { domainEventCodec } from '../types/codecs/DomainEvent';
import { CommandResult } from '../types/command-result';

type Dependencies = {
  inMemoryEvents: Array<DomainEvent>,
  pool: Pool,
  logger: L.Logger,
};

export const writeEventToDatabase = (pool: Pool) => (event: RuntimeGeneratedEvent): T.Task<void> => pipe(
  event,
  domainEventCodec.encode,
  ({
    id, type, date, ...payload
  }) => [id, type, date, payload],
  (values) => async () => pool.query(
    'INSERT INTO events (id, type, date, payload) VALUES ($1, $2, $3, $4);',
    values,
  ),
  T.map(() => undefined),
);

const teeTask = <A>(fn: (a: A) => void) => (task: T.Task<A>) => async (): Promise<A> => {
  const value = await task();
  fn(value);
  return value;
};

const logTask = <A>(
  logger: Logger,
  level: 'info',
  msg: string,
  payloadConstructor: (a: A) => Record<string, unknown>,
) => (task: T.Task<A>) => pipe(
    task,
    T.chainFirst(flow(
      (data) => logger(level, msg, payloadConstructor(data)),
      T.of,
    )),
  );

export type CommitEvents = (event: ReadonlyArray<RuntimeGeneratedEvent>) => T.Task<CommandResult>;

export const commitEvents = ({ inMemoryEvents, pool, logger }: Dependencies): CommitEvents => (events) => pipe(
  events,
  T.traverseArray(flow(
    T.of,
    T.chainFirst(writeEventToDatabase(pool)),
    teeTask((event) => logger('info', 'Event committed', { event })),
    logTask(logger, 'info', 'Event committed', (event) => ({ event })),
    T.chainFirstIOK(flow((event) => inMemoryEvents.push(event), IO.of)),
  )),
  T.map(RA.match(
    () => 'no-events-created',
    () => 'events-created',
  )),
);
