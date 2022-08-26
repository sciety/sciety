import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isListCreatedEvent, ListCreatedEvent } from '../domain-events';

type NeedsToBeAdded = (existingEvents: ReadonlyArray<DomainEvent>,)
=> (eventToAdd: ListCreatedEvent)
=> boolean;

export const needsToBeAdded: NeedsToBeAdded = (existingEvents) => (eventToAdd) => pipe(
  existingEvents,
  RA.filter(isListCreatedEvent),
  RA.some((event) => event.listId === eventToAdd.listId),
  (found) => !found,
);
