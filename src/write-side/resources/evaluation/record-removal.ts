import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as B from 'fp-ts/boolean';
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

export const recordRemoval: ResourceAction<RecordEvaluationRemovalCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.evaluationLocator === command.evaluationLocator),
  RA.last,
  E.fromOption(() => evaluationDoesNotExist),
  E.map(isEventOfType('EvaluationRecorded')),
  E.map(
    B.match(
      () => [],
      () => [constructEvent('EvaluationRemovalRecorded')({ ...command, reason: 'published-on-incorrect-article' })],
    ),
  ),
);
