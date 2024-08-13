import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { ExpressionDoi } from '../../types/expression-doi';

const update = (union: Set<ExpressionDoi>, set: Set<ExpressionDoi>) => {
  set.forEach((expression) => union.add(expression));
  return union;
};

export const getExpressionsWithNoAssociatedSnapshot = (
  readModel: ReadModel,
) => (): ReadonlyArray<ExpressionDoi> => pipe(
  Object.values(readModel.evaluatedExpressionsWithoutPaperSnapshot),
  RA.reduce(new Set<ExpressionDoi>(), update),
  (set) => Array.from(set),
);
