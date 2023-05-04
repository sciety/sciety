import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  incorrectlyRecordedEvaluationErased,
  DomainEvent,
  isEvaluationRecordedEvent,
  EvaluationRecordedEvent, IncorrectlyRecordedEvaluationErasedEvent, isIncorrectlyRecordedEvaluationErasedEvent,
} from '../../../domain-events';
import { EraseEvaluationCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

type RelevantEvent = EvaluationRecordedEvent | IncorrectlyRecordedEvaluationErasedEvent;

const isRelevantEvent = (event: DomainEvent): event is RelevantEvent => (
  isEvaluationRecordedEvent(event) || isIncorrectlyRecordedEvaluationErasedEvent(event)
);

export const erase: ResourceAction<EraseEvaluationCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.evaluationLocator === command.evaluationLocator),
  RA.last,
  O.filter(isEvaluationRecordedEvent),
  O.match(
    () => [],
    () => [incorrectlyRecordedEvaluationErased(command.evaluationLocator)],
  ),
  E.right,
);
