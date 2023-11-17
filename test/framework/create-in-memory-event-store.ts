import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { DomainEvent } from '../../src/domain-events/index.js';
import { GetAllEvents, CommitEvents } from '../../src/shared-ports/index.js';
import { dummyLogger } from '../dummy-logger.js';
import { commitEvents } from '../../src/infrastructure/commit-events.js';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type EventStore = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

export const createInMemoryEventStore = (dispatchToAllReadModels: DispatchToAllReadModels): EventStore => {
  const allEvents: Array<DomainEvent> = [];
  return {
    getAllEvents: T.of(allEvents),
    commitEvents: commitEvents({
      inMemoryEvents: allEvents,
      dispatchToAllReadModels,
      persistEvents: () => TE.right(undefined),
      logger: dummyLogger,
    }),
  };
};
