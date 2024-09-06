import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent, DomainEvent } from '../../../domain-events';
import { toErrorMessage } from '../../../types/error-message';
import { RecordPaperSnapshotCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const validateCommand = (command: RecordPaperSnapshotCommand) => command.expressionDois.size > 0;

const changeState = (command: RecordPaperSnapshotCommand) => [
  constructEvent('PaperSnapshotRecorded')({ expressionDois: command.expressionDois }),
];

const decideWhetherToChangeState = (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  events: ReadonlyArray<DomainEvent>,
) => (
  command: RecordPaperSnapshotCommand,
) => changeState(command);

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
