import { ReadModel } from './handle-event';
import { ExpressionDoi } from '../../types/expression-doi';

export const getExpressionsWithNoAssociatedSnapshot = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readModel: ReadModel,
) => (): ReadonlyArray<ExpressionDoi> => [];
