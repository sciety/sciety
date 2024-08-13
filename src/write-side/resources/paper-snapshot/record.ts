/* eslint-disable @typescript-eslint/no-unused-vars */
import * as E from 'fp-ts/Either';
import { RecordPaperSnapshotCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

// ts-unused-exports:disable-next-line
export const record: ResourceAction<RecordPaperSnapshotCommand> = (command) => (events) => E.right([]);
