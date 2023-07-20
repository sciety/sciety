import * as T from 'fp-ts/Task';
import { Pool } from 'pg';
import * as L from './logger';
import { DomainEvent } from '../domain-events';
import { CommandResult } from '../types/command-result';
import { persistEvents } from './persist-events';

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
}: Dependencies): CommitEvents => (events) => async () => {
  if (events.length === 0) {
    return 'no-events-created' as CommandResult;
  }
  await persistEvents(pool)(events);
  inMemoryEvents.push(...events);
  dispatchToAllReadModels(events);
  logger('info', 'Events committed', { events });
  return 'events-created' as CommandResult;
};
