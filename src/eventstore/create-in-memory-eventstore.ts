import { pipe } from 'fp-ts/function';
import * as T from 'fp-ts/Task';
import * as RA from 'fp-ts/ReadonlyArray';
import { DomainEvent } from '../../src/domain-events';
import { GetAllEvents, CommitEvents } from '../../src/shared-ports';
import { CommandResult } from '../../src/types/command-result';

type DispatchToAllListeners = (events: ReadonlyArray<DomainEvent>) => void;

const commitEvents = (
  inMemoryEvents: Array<DomainEvent>,
  dispatchToAllListeners: (events: ReadonlyArray<DomainEvent>) => void,
): CommitEvents => (events) => pipe(
  events,
  RA.match(
    () => ('no-events-created' as CommandResult),
    (es) => {
      pipe(
        es,
        RA.map((event) => { inMemoryEvents.push(event); return event; }),
      );
      dispatchToAllListeners(es);
      return 'events-created' as CommandResult;
    },
  ),
  T.of,
);

type Eventstore = {
  getAllEvents: GetAllEvents,
  commitEvents: CommitEvents,
};

export const createInMemoryEventstore = (dispatchToAllListeners: DispatchToAllListeners): Eventstore => {
  const allEvents: Array<DomainEvent> = [];
  return {
    getAllEvents: T.of(allEvents),
    commitEvents: commitEvents(allEvents, dispatchToAllListeners),
  };
};
