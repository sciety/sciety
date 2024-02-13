import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { List } from './list';
import { ExpressionDoi } from '../../types/expression-doi';

const isListContaining = (expressionDoi: ExpressionDoi) => (list: List) => pipe(
  list.entries,
  RA.map((entry) => entry.expressionDoi),
  (listOfExpressionDois) => listOfExpressionDois.includes(expressionDoi),
);

type SelectAllListsContainingExpression = (expressionDoi: ExpressionDoi) => ReadonlyArray<List>;

export const selectAllListsContainingExpression = (
  readModel: ReadModel,
): SelectAllListsContainingExpression => (expressionDoi) => pipe(
  Object.values(readModel),
  RA.filter(isListContaining(expressionDoi)),
);
