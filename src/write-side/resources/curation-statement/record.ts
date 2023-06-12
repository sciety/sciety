import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as B from 'fp-ts/boolean';
import * as E from 'fp-ts/Either';
import { RecordCurationStatementCommand } from '../../commands/record-curation-statement';
import { ResourceAction } from '../resource-action';
import { DomainEvent, constructEvent, isEventOfType } from '../../../domain-events';
import { EvaluationLocator } from '../../../types/evaluation-locator';

const hasEvaluationLocatorAlreadyBeenRecordedInCurationStatement = (
  evaluationLocator: EvaluationLocator,
) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isEventOfType('CurationStatementRecorded')),
  RA.some((event) => event.evaluationLocator === evaluationLocator),
);

export const record: ResourceAction<RecordCurationStatementCommand> = (command) => (events) => pipe(
  events,
  hasEvaluationLocatorAlreadyBeenRecordedInCurationStatement(command.evaluationLocator),
  B.fold(
    () => [
      constructEvent('CurationStatementRecorded')({
        articleId: command.articleId,
        groupId: command.groupId,
        evaluationLocator: command.evaluationLocator,
      }),
    ],
    () => [],
  ),
  E.right,
);
