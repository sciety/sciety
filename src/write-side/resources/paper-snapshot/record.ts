import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../domain-events';
import { toErrorMessage } from '../../../types/error-message';
import { RecordPaperSnapshotCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

const validateCommand = (command: RecordPaperSnapshotCommand) => command.expressionDois.size > 0;

const causeStateChange = (command: RecordPaperSnapshotCommand) => [
  constructEvent('PaperSnapshotRecorded')({ expressionDois: command.expressionDois }),
];

export const record: ResourceAction<RecordPaperSnapshotCommand> = (
  command,
) => (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  events,
) => pipe(
  command,
  E.right,
  E.filterOrElse(validateCommand, () => toErrorMessage('')),
  E.map(causeStateChange),
);
