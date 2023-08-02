import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import {
  DomainEvent, isEventOfType, constructEvent, EventOfType,
} from '../../../domain-events';
import { EraseEvaluationCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

type RelevantEvent = EventOfType<'EvaluationPublicationRecorded'> | EventOfType<'IncorrectlyRecordedEvaluationErased'>;

const isRelevantEvent = (event: DomainEvent): event is RelevantEvent => (
  isEventOfType('EvaluationPublicationRecorded')(event) || isEventOfType('IncorrectlyRecordedEvaluationErased')(event)
);

export const erase: ResourceAction<EraseEvaluationCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.evaluationLocator === command.evaluationLocator),
  RA.last,
  O.filter(isEventOfType('EvaluationPublicationRecorded')),
  O.match(
    () => [],
    () => [constructEvent('IncorrectlyRecordedEvaluationErased')(command)],
  ),
  E.right,
);
