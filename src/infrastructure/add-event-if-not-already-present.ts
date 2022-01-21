import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, EvaluationRecordedEvent, isEvaluationRecordedEvent } from '../domain-events';

type AddEventIfNotAlreadyPresent = (
  existingEvents: ReadonlyArray<DomainEvent>,
  eventToAdd: EvaluationRecordedEvent) => boolean;

export const addEventIfNotAlreadyPresent: AddEventIfNotAlreadyPresent = (existingEvents, eventToAdd) => pipe(
  existingEvents,
  RA.filter(isEvaluationRecordedEvent),
  RA.some((event) => event.evaluationLocator === eventToAdd.evaluationLocator),
  (isAlreadyPresent) => !isAlreadyPresent,
);
