import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { ResourceAction } from '../resource-action';
import { RecordEvaluationRemovalCommand } from '../../commands';
import {
  constructEvent, DomainEvent, EventOfType, isEventOfType,
} from '../../../domain-events';
import { evaluationResourceError } from './evaluation-resource-error';

type RelevantEvent = EventOfType<'EvaluationPublicationRecorded'> | EventOfType<'EvaluationRemovalRecorded'> | EventOfType<'IncorrectlyRecordedEvaluationErased'>;

const isRelevantEvent = (event: DomainEvent): event is RelevantEvent => (
  isEventOfType('EvaluationPublicationRecorded')(event) || isEventOfType('EvaluationRemovalRecorded')(event) || isEventOfType('IncorrectlyRecordedEvaluationErased')(event)
);

const decideResult = (command: RecordEvaluationRemovalCommand) => (event: RelevantEvent) => {
  if (isEventOfType('EvaluationPublicationRecorded')(event)) {
    return E.right([constructEvent('EvaluationRemovalRecorded')({ ...command, reason: 'published-on-incorrect-article' })]);
  }
  if (isEventOfType('EvaluationRemovalRecorded')(event)) {
    return E.right([]);
  }
  if (isEventOfType('IncorrectlyRecordedEvaluationErased')(event)) {
    return E.left(evaluationResourceError.doesNotExist);
  }
  // unreachable!
  return E.right([]);
};

export const recordRemoval: ResourceAction<RecordEvaluationRemovalCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.evaluationLocator === command.evaluationLocator),
  RA.last,
  E.fromOption(() => evaluationResourceError.doesNotExist),
  E.chainW(decideResult(command)),
);
