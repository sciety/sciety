import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../domain-events';
import { GroupsReadModel, groupsReadModelReducer } from '../shared-read-models/groups';

let lastKnownEventNumber = 0;

const readModel = new Map();

export const statefulGroupsReadModel = (events: ReadonlyArray<DomainEvent>): GroupsReadModel => pipe(
  events,
  RA.splitAt(lastKnownEventNumber),
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ([_knownEvents, newEvents]) => newEvents,
  RA.reduce(readModel, groupsReadModelReducer),
  (updatedModel) => {
    lastKnownEventNumber = events.length;
    return updatedModel;
  },
);
