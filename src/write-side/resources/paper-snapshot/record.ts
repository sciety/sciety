import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../domain-events';
import { toErrorMessage } from '../../../types/error-message';
import { RecordPaperSnapshotCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

export const record: ResourceAction<RecordPaperSnapshotCommand> = (
  command,
) => (
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  events,
) => (command.expressionDois.size > 0
  ? E.right([constructEvent('PaperSnapshotRecorded')({ expressionDois: command.expressionDois })])
  : E.left(toErrorMessage('')));
