import { DomainEvent, EvaluationRecordedEvent } from '../domain-events';

type AddEventIfNotAlreadyPresent = (
  existingEvents: ReadonlyArray<DomainEvent>,
  eventToAdd: EvaluationRecordedEvent) => ReadonlyArray<EvaluationRecordedEvent>;

export const addEventIfNotAlreadyPresent: AddEventIfNotAlreadyPresent = (existingEvents, eventToAdd) => [eventToAdd];
