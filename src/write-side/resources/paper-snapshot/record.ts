import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { getEq } from 'fp-ts/Set';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { filterByName, constructEvent, DomainEvent } from '../../../domain-events';
import { toErrorMessage } from '../../../types/error-message';
import { eqExpressionDoi } from '../../../types/expression-doi';
import { RecordPaperSnapshotCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const validateCommand = (command: RecordPaperSnapshotCommand) => command.expressionDois.size > 0;

const changeState = (command: RecordPaperSnapshotCommand) => [
  constructEvent('PaperSnapshotRecorded')({ expressionDois: command.expressionDois }),
];

const decideWhetherToChangeState = (
  events: ReadonlyArray<DomainEvent>,
) => (
  command: RecordPaperSnapshotCommand,
) => pipe(
  events,
  filterByName(['PaperSnapshotRecorded']),
  RA.some((event) => getEq(eqExpressionDoi).equals(event.expressionDois, command.expressionDois)),
  B.fold(
    () => changeState(command),
    () => [],
  ),
);

export const record: ResourceAction<RecordPaperSnapshotCommand> = (
  command,
) => (
  events,
) => pipe(
  command,
  E.right,
  E.filterOrElse(validateCommand, () => toErrorMessage('')),
  E.map(decideWhetherToChangeState(events)),
);
