import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as L from './logger';
import { DomainEvent } from '../domain-events';
import { CommandResult } from '../types/command-result';
import { CommitEvents } from '../shared-ports';

type Dependencies = {
  inMemoryEvents: Array<DomainEvent>,
  dispatchToAllReadModels: (events: ReadonlyArray<DomainEvent>) => void,
  persistEvents: (events: ReadonlyArray<DomainEvent>) => TE.TaskEither<never, void>,
  logger: L.Logger,
};

export const commitEvents = ({
  inMemoryEvents,
  dispatchToAllReadModels,
  persistEvents,
  logger,
}: Dependencies): CommitEvents => (events) => async () => {
  if (events.length === 0) {
    return E.right('no-events-created' as CommandResult);
  }
  await persistEvents(events)();
  inMemoryEvents.push(...events);
  dispatchToAllReadModels(events);
  logger('info', 'Events committed', { events });
  return E.right('events-created' as CommandResult);
};
