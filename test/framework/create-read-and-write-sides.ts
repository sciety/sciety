import { createInMemoryEventStore } from './create-in-memory-event-store';
import { EventStore } from '../../src/event-store';
import { dispatcher, Queries } from '../../src/read-models';
import { dummyLogger } from '../dummy-logger';

export type ReadAndWriteSides = EventStore & {
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
