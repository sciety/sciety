import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { RecordCurationStatementCommand } from '../../commands/record-curation-statement';
import { ResourceAction } from '../resource-action';
import { DomainEvent, constructEvent, isEventOfType } from '../../../domain-events';
import { EvaluationLocator } from '../../../types/evaluation-locator';

const existingCurationStatementsUsing = (
  evaluationLocator: EvaluationLocator,
) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isEventOfType('CurationStatementRecorded')),
  RA.filter((event) => event.evaluationLocator === evaluationLocator),
);

export const record: ResourceAction<RecordCurationStatementCommand> = (command) => (events) => pipe(
  events,
  existingCurationStatementsUsing(command.evaluationLocator),
  RA.match(
    () => [
      constructEvent('CurationStatementRecorded')(command),
    ],
    () => [],
  ),
  E.right,
);
