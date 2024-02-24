import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event.js';
import { List } from './list.js';
import { ExpressionDoi } from '../../types/expression-doi.js';

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
