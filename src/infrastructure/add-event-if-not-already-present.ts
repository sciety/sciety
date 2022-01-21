import { DomainEvent } from '../domain-events';

type AddEventIfNotAlreadyPresent = (
  existingEvents: ReadonlyArray<DomainEvent>,
  eventToAdd: DomainEvent) => ReadonlyArray<DomainEvent>;

export const addEventIfNotAlreadyPresent: AddEventIfNotAlreadyPresent = (existingEvents, eventToAdd) => [eventToAdd];
