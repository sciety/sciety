import { pipe } from 'fp-ts/function';
import { Dependencies } from './dependencies';
import { ExpressionDoi } from '../../../types/expression-doi';
import { List } from '../../../types/list';

export const findAllListsContainingPaper = (
  dependencies: Dependencies,
) => (
  expressionDoi: ExpressionDoi,
): ReadonlyArray<List> => pipe(
  expressionDoi,
  dependencies.selectAllListsContainingExpression,
);
