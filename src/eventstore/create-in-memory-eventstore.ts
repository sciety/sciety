import * as T from 'fp-ts/Task';
import { pipe } from 'fp-ts/function';

type CommandResult = 'events-created' | 'no-events-created';

type InformListener<V> = (items: ReadonlyArray<V>) => T.Task<void>;

const commitEvents = <V>(
  store: Array<V>,
  informListener: InformListener<V>,
) => (items: ReadonlyArray<V>) => {
    if (items.length === 0) {
      return T.of('no-events-created' as CommandResult);
    }
    store.push(...items);
    return pipe(
      informListener(items),
      T.map(() => 'events-created' as CommandResult),
    );
  };

type Eventstore<V> = {
  getAllEvents: T.Task<ReadonlyArray<V>>,
  commitEvents: (items: ReadonlyArray<V>) => T.Task<CommandResult>,
};

// ts-unused-exports:disable-next-line
export const createInMemoryEventstore = <V>(informListener: InformListener<V>): Eventstore<V> => {
  const allCurrentItems: Array<V> = [];
  return {
    getAllEvents: T.of(allCurrentItems as ReadonlyArray<V>),
    commitEvents: commitEvents<V>(allCurrentItems, informListener),
  };
};
