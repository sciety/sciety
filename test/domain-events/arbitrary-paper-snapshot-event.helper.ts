import { constructEvent, EventOfType } from '../../src/domain-events';
import { arbitraryExpressionDoi } from '../types/expression-doi.helper';

export const arbitraryPaperSnapshotRecordedEvent = (): EventOfType<'PaperSnapshotRecorded'> => constructEvent('PaperSnapshotRecorded')({
  expressionDois: new Set([
    arbitraryExpressionDoi(),
    arbitraryExpressionDoi(),
    arbitraryExpressionDoi(),
  ]),
});
