import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { ResourceAction } from '../resource-action';
import { RecordEvaluationRemovalCommand } from '../../commands';
import {
  constructEvent, DomainEvent, EventOfType, isEventOfType,
} from '../../../domain-events';
import { evaluationDoesNotExist } from './evaluation-does-not-exist';

type RelevantEvent = EventOfType<'EvaluationRecorded'> | EventOfType<'EvaluationRemovalRecorded'>;

const isRelevantEvent = (event: DomainEvent): event is RelevantEvent => (
  isEventOfType('EvaluationRecorded')(event) || isEventOfType('EvaluationRemovalRecorded')(event)
);

const decideResult = (command: RecordEvaluationRemovalCommand) => (event: RelevantEvent) => {
  if (isEventOfType('EvaluationRecorded')(event)) {
    return [constructEvent('EvaluationRemovalRecorded')({ ...command, reason: 'published-on-incorrect-article' })];
  }
  if (isEventOfType('EvaluationRemovalRecorded')(event)) {
    return [];
  }
  // unreachable!
  return [];
};

export const recordRemoval: ResourceAction<RecordEvaluationRemovalCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.evaluationLocator === command.evaluationLocator),
  RA.last,
  E.fromOption(() => evaluationDoesNotExist),
  E.map(decideResult(command)),
);
