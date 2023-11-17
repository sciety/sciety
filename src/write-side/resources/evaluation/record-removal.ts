import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { ResourceAction } from '../resource-action.js';
import { RecordEvaluationRemovalCommand } from '../../commands/index.js';
import {
  constructEvent, DomainEvent, EventOfType, isEventOfType,
} from '../../../domain-events/index.js';
import { evaluationResourceError } from './evaluation-resource-error.js';

type RelevantEvent = EventOfType<'EvaluationPublicationRecorded'> | EventOfType<'EvaluationRemovalRecorded'> | EventOfType<'IncorrectlyRecordedEvaluationErased'>;

const isRelevantEvent = (event: DomainEvent): event is RelevantEvent => (
  isEventOfType('EvaluationPublicationRecorded')(event) || isEventOfType('EvaluationRemovalRecorded')(event) || isEventOfType('IncorrectlyRecordedEvaluationErased')(event)
);

const decideResult = (command: RecordEvaluationRemovalCommand) => (event: RelevantEvent) => {
  switch (event.type) {
    case 'EvaluationPublicationRecorded':
      return E.right([constructEvent('EvaluationRemovalRecorded')({ ...command, reason: 'published-on-incorrect-article' })]);
    case 'EvaluationRemovalRecorded':
      return E.right([]);
    case 'IncorrectlyRecordedEvaluationErased':
      return E.left(evaluationResourceError.doesNotExist);
  }
};

export const recordRemoval: ResourceAction<RecordEvaluationRemovalCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.evaluationLocator === command.evaluationLocator),
  RA.last,
  E.fromOption(() => evaluationResourceError.doesNotExist),
  E.chainW(decideResult(command)),
);
