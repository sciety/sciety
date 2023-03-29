import * as T from 'fp-ts/Task';

type CommandResult = 'events-created' | 'no-events-created';

type DispatchToAllListeners<V> = (items: ReadonlyArray<V>) => void;

const commitEvents = <V>(
  store: Array<V>,
  dispatchToAllListeners: DispatchToAllListeners<V>,
) => (items: ReadonlyArray<V>) => {
    if (items.length === 0) {
      return T.of('no-events-created' as CommandResult);
    }
    store.push(...items);
    dispatchToAllListeners(items);
    return T.of('events-created' as CommandResult);
  };

type Eventstore<V> = {
  getAllEvents: T.Task<ReadonlyArray<V>>,
  commitEvents: (items: ReadonlyArray<V>) => T.Task<CommandResult>,
};

export const createInMemoryEventstore = <V>(dispatchToAllListeners: DispatchToAllListeners<V>): Eventstore<V> => {
  const allCurrentItems: Array<V> = [];
  return {
    getAllEvents: T.of(allCurrentItems as ReadonlyArray<V>),
    commitEvents: commitEvents<V>(allCurrentItems, dispatchToAllListeners),
  };
};
