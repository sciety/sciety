import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import { constructEvent } from '../../../domain-events';
import { RecordPaperSnapshotCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const record: ResourceAction<RecordPaperSnapshotCommand> = (command) => (events) => pipe(
  command,
  constructEvent('PaperSnapshotRecorded'),
  (event) => E.right([event]),
);
