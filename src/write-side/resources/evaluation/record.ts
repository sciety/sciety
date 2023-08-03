import * as RA from 'fp-ts/ReadonlyArray';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { RecordEvaluationCommand } from '../../commands';
import {
  DomainEvent, constructEvent, isEventOfType, EventOfType,
} from '../../../domain-events';
import { ResourceAction } from '../resource-action';

type RelevantEvent = EventOfType<'EvaluationRecorded'> | EventOfType<'IncorrectlyRecordedEvaluationErased'>;

const isRelevantEvent = (event: DomainEvent): event is RelevantEvent => (
  isEventOfType('EvaluationRecorded')(event) || isEventOfType('IncorrectlyRecordedEvaluationErased')(event)
);

const createEvaluationRecordedEvent = (command: RecordEvaluationCommand) => constructEvent(
  'EvaluationRecorded',
)({
  groupId: command.groupId,
  articleId: command.articleId,
  evaluationLocator: command.evaluationLocator,
  authors: command.authors,
  publishedAt: command.publishedAt,
  date: command.issuedAt ? command.issuedAt : new Date(),
  evaluationType: command.evaluationType ? command.evaluationType : undefined,
});

export const record: ResourceAction<RecordEvaluationCommand> = (command) => (events) => pipe(
  events,
  RA.filter(isRelevantEvent),
  RA.filter((event) => event.evaluationLocator === command.evaluationLocator),
  RA.last,
  O.match(
    () => [createEvaluationRecordedEvent(command)],
    (event) => (isEventOfType('EvaluationRecorded')(event) ? [] : [createEvaluationRecordedEvent(command)]),
  ),
  E.right,
);
