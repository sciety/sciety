import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as L from './logger.js';
import { DomainEvent } from '../domain-events/index.js';
import { CommandResult } from '../types/command-result.js';
import { CommitEvents } from '../shared-ports/index.js';
import { ErrorMessage } from '../types/error-message.js';

type Dependencies = {
  inMemoryEvents: Array<DomainEvent>,
  dispatchToAllReadModels: (events: ReadonlyArray<DomainEvent>) => void,
  persistEvents: (events: ReadonlyArray<DomainEvent>) => TE.TaskEither<ErrorMessage, void>,
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
  const resultOfPersistEvents = await persistEvents(events)();
  if (E.isLeft(resultOfPersistEvents)) {
    logger('error', resultOfPersistEvents.left);
    return resultOfPersistEvents;
  }
  inMemoryEvents.push(...events);
  dispatchToAllReadModels(events);
  logger('info', 'Events committed', { events });
  return E.right('events-created' as CommandResult);
};
