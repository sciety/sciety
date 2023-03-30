import * as IO from 'fp-ts/IO';
import * as RA from 'fp-ts/ReadonlyArray';
import * as T from 'fp-ts/Task';
import { flow, pipe } from 'fp-ts/function';
import { Pool } from 'pg';
import * as L from './logger';
import { DomainEvent } from '../domain-events';
import { writeEventToDatabase } from '../eventstore/write-event-to-database';
import { CommandResult } from '../types/command-result';

type Dependencies = {
  inMemoryEvents: Array<DomainEvent>,
  dispatchToAllReadModels: (events: ReadonlyArray<DomainEvent>) => void,
  pool: Pool,
  logger: L.Logger,
};

type CommitEvents = (event: ReadonlyArray<DomainEvent>) => T.Task<CommandResult>;

export const commitEvents = ({
  inMemoryEvents,
  dispatchToAllReadModels,
  pool,
  logger,
}: Dependencies): CommitEvents => (events) => pipe(
  events,
  RA.match(
    () => T.of('no-events-created' as CommandResult),
    (es) => pipe(
      es,
      T.traverseArray(flow(
        T.of,
        T.chainFirst(writeEventToDatabase(pool)),
        T.chainFirst((event) => {
          logger('info', 'Event committed', { event });
          return T.of(undefined);
        }),
        T.chainFirstIOK(flow((event) => inMemoryEvents.push(event), IO.of)),
      )),
      T.map(dispatchToAllReadModels),
      T.map(() => 'events-created' as CommandResult),
    ),
  ),
);
