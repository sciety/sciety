import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { RecordEvaluationCommand } from '../../commands';
import { DomainEvent, constructEvent, isEventOfType } from '../../../domain-events';
import { EvaluationLocator } from '../../../types/evaluation-locator';
import { ResourceAction } from '../resource-action';

const hasEvaluationAlreadyBeenRecorded = (
  evaluationLocator: EvaluationLocator,
) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isEventOfType('EvaluationPublicationRecorded')),
  RA.some((event) => event.evaluationLocator === evaluationLocator),
);

const createEvaluationPublicationRecordedEvent = (command: RecordEvaluationCommand) => constructEvent(
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

export const record: ResourceAction<RecordEvaluationCommand> = (command) => (events) => pipe(
  events,
  hasEvaluationAlreadyBeenRecorded(command.evaluationLocator),
  B.fold(
    () => [createEvaluationPublicationRecordedEvent(command)],
    () => [],
  ),
  E.right,
);
