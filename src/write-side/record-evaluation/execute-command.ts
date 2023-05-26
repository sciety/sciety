import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { RecordEvaluationCommand } from '../commands';
import {
  DomainEvent, constructEvent, isEvaluationRecordedEvent,
} from '../../domain-events';
import { EvaluationLocator } from '../../types/evaluation-locator';
import { ErrorMessage } from '../../types/error-message';

const hasEvaluationAlreadyBeenRecorded = (
  evaluationLocator: EvaluationLocator,
) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isEvaluationRecordedEvent),
  RA.some((event) => event.evaluationLocator === evaluationLocator),
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
});

type ExecuteCommand = (command: RecordEvaluationCommand)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ReadonlyArray<DomainEvent>>;

export const executeCommand: ExecuteCommand = (command) => (events) => pipe(
  events,
  hasEvaluationAlreadyBeenRecorded(command.evaluationLocator),
  B.fold(
    () => [createEvaluationRecordedEvent(command)],
    () => [],
  ),
  E.right,
);
