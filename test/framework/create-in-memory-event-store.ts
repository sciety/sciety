import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { DomainEvent } from '../../src/domain-events';
import { EventStore } from '../../src/event-store';
import { commitEvents } from '../../src/infrastructure/commit-events';
import { dummyLogger } from '../dummy-logger';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

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
