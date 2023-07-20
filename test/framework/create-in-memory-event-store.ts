import * as T from 'fp-ts/Task';
import { DomainEvent } from '../../src/domain-events';
import { GetAllEvents, CommitEvents } from '../../src/shared-ports';
import { dummyLogger } from '../dummy-logger';
import { commitEvents } from '../../src/infrastructure/commit-events';

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
      persistEvents: async () => undefined,
      logger: dummyLogger,
    }),
  };
};
