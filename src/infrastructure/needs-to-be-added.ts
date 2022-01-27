import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { DomainEvent, EvaluationRecordedEvent, isEvaluationRecordedEvent } from '../domain-events';

type NeedsToBeAdded = (existingEvents: ReadonlyArray<DomainEvent>,)
=> (eventToAdd: EvaluationRecordedEvent)
=> boolean;

export const needsToBeAdded: NeedsToBeAdded = (existingEvents) => pipe(
  existingEvents,
  RA.filter(isEvaluationRecordedEvent),
  RA.map((event) => event.evaluationLocator),
  (evaluationLocators) => new Set(evaluationLocators),
  (evaluationLocators) => (eventToAdd) => pipe(
    evaluationLocators.has(eventToAdd.evaluationLocator),
    (isAlreadyPresent) => !isAlreadyPresent,
  ),
);
