import { RecordPaperSnapshotCommand } from '../../../src/write-side/commands';
import { arbitraryExpressionDoi } from '../../types/expression-doi.helper';

export const arbitraryRecordPaperSnapshotCommand = (): RecordPaperSnapshotCommand => ({
  expressionDois: [arbitraryExpressionDoi()],
});
