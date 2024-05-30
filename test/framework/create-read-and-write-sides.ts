import { createInMemoryEventStore } from './create-in-memory-event-store';
import { dispatcher, Queries } from '../../src/read-models';
import { GetAllEvents, CommitEvents } from '../../src/shared-ports';

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
