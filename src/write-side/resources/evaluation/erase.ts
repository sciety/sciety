import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent,
  EvaluationRecordedEvent, IncorrectlyRecordedEvaluationErasedEvent, isEventOfType, constructEvent,
} from '../../../domain-events';
import { EraseEvaluationCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

type RelevantEvent = EvaluationRecordedEvent | IncorrectlyRecordedEvaluationErasedEvent;

const isRelevantEvent = (event: DomainEvent): event is RelevantEvent => (
  isEventOfType('EvaluationRecorded')(event) || isEventOfType('IncorrectlyRecordedEvaluationErased')(event)
);

export const erase: ResourceAction<EraseEvaluationCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.evaluationLocator === command.evaluationLocator),
  RA.last,
  O.filter(isEventOfType('EvaluationRecorded')),
  O.match(
    () => [],
    () => [constructEvent('IncorrectlyRecordedEvaluationErased')(command)],
  ),
  E.right,
);
