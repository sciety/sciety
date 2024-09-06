import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { RecordPaperSnapshotCommand } from '../../../src/write-side/commands';
import { arbitraryNumber } from '../../helpers';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';

export const arbitraryRecordPaperSnapshotCommand = (): RecordPaperSnapshotCommand => pipe(
  RA.replicate(arbitraryNumber(1, 10), undefined),
  RA.map(() => arbitraryExpressionDoi()),
  (expressionDois) => ({
    expressionDois: new Set(expressionDois),
  }),
);
