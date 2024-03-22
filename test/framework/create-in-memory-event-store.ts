import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';
import { DomainEvent } from '../../src/domain-events';
import { GetAllEvents, CommitEvents } from '../../src/shared-ports';
import { dummyLogger } from '../dummy-logger';
import { createCommitEvents } from '../../src/infrastructure/create-commit-events';
import { InMemoryEvents } from '../../src/process-contract';

type DispatchToAllReadModels = (events: ReadonlyArray<DomainEvent>) => void;

type EventStore = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

export const createInMemoryEventStore = (dispatchToAllReadModels: DispatchToAllReadModels): EventStore => {
  const allEvents: InMemoryEvents = [];
  return {
    getAllEvents: T.of(allEvents),
    commitEvents: createCommitEvents({
      inMemoryEvents: allEvents,
      dispatchToAllReadModels,
      persistEvents: () => TE.right(undefined),
      logger: dummyLogger,
    }),
  };
};
