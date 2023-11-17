import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { evaluationResourceError } from './evaluation-resource-error.js';
import { RecordEvaluationPublicationCommand } from '../../commands/index.js';
import {
  DomainEvent, constructEvent, isEventOfType, EventOfType,
} from '../../../domain-events/index.js';
import { ResourceAction } from '../resource-action.js';

type RelevantEvent = EventOfType<'EvaluationPublicationRecorded'> | EventOfType<'IncorrectlyRecordedEvaluationErased'> | EventOfType<'EvaluationRemovalRecorded'>;

const isRelevantEvent = (event: DomainEvent): event is RelevantEvent => (
  isEventOfType('EvaluationPublicationRecorded')(event) || isEventOfType('IncorrectlyRecordedEvaluationErased')(event) || isEventOfType('EvaluationRemovalRecorded')(event)
);

const createEvaluationPublicationRecordedEvent = (command: RecordEvaluationPublicationCommand) => constructEvent(
  'EvaluationPublicationRecorded',
)({
  groupId: command.groupId,
  articleId: command.articleId,
  evaluationLocator: command.evaluationLocator,
  authors: command.authors,
  publishedAt: command.publishedAt,
  date: command.issuedAt ? command.issuedAt : new Date(),
  evaluationType: command.evaluationType ? command.evaluationType : undefined,
});

const decideResult = (command: RecordEvaluationPublicationCommand) => (event: RelevantEvent) => {
  switch (event.type) {
    case 'EvaluationPublicationRecorded':
      return E.right([]);

    case 'IncorrectlyRecordedEvaluationErased':
      return E.right([createEvaluationPublicationRecordedEvent(command)]);

    case 'EvaluationRemovalRecorded':
      return E.left(evaluationResourceError.previouslyRemovedCannotRecord);
  }
};

export const recordPublication: ResourceAction<RecordEvaluationPublicationCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.evaluationLocator === command.evaluationLocator),
  RA.last,
  O.match(
    () => E.right([createEvaluationPublicationRecordedEvent(command)]),
    (event) => decideResult(command)(event),
  ),
);
