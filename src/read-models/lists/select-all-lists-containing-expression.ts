import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { List } from '../../types/list';
import { ExpressionDoi } from '../../types/expression-doi';

type SelectAllListsContainingExpression = (expressionDoi: ExpressionDoi) => ReadonlyArray<List>;

export const selectAllListsContainingExpression = (
  readModel: ReadModel,
): SelectAllListsContainingExpression => (expressionDoi) => pipe(
  Object.values(readModel),
  RA.filter((list) => list.expressionDois.includes(expressionDoi)),
);
