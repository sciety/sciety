import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { constructEvent, EventOfType } from '../../src/domain-events';
import { arbitraryNumber } from '../helpers';
import { arbitraryExpressionDoi } from '../types/expression-doi.helper';

export const arbitraryPaperSnapshotRecordedEvent = (): EventOfType<'PaperSnapshotRecorded'> => pipe(
  RA.replicate(arbitraryNumber(1, 10), undefined),
  RA.map(() => arbitraryExpressionDoi()),
  (expressionDois) => constructEvent('PaperSnapshotRecorded')({
    expressionDois: new Set(expressionDois),
  }),
);
