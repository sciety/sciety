import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { DomainEvent } from '../../src/domain-events';
import { CommitEvents } from '../../src/event-store/commit-events';
import { GetAllEvents } from '../../src/event-store/get-all-events';
import { commitEvents } from '../../src/infrastructure/commit-events';
import { dummyLogger } from '../dummy-logger';

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
