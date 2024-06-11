import { createInMemoryEventStore } from './create-in-memory-event-store';
import { CommitEvents } from '../../src/event-store/commit-events';
import { GetAllEvents } from '../../src/event-store/get-all-events';
import { dispatcher, Queries } from '../../src/read-models';
import { dummyLogger } from '../dummy-logger';

export type ReadAndWriteSides = {
  commitEvents: CommitEvents,
  getAllEvents: GetAllEvents,
  queries: Queries,
};

export const createReadAndWriteSides = (): ReadAndWriteSides => {
  const { dispatchToAllReadModels, queries } = dispatcher(dummyLogger);
  const eventStore = createInMemoryEventStore(dispatchToAllReadModels);
  return {
    ...eventStore,
    queries,
  };
};
