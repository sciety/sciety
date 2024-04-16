import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { List } from './list';
import { ExpressionDoi } from '../../types/expression-doi';
import * as LOID from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';

const isListContaining = (expressionDoi: ExpressionDoi) => (list: List) => pipe(
  list.entries,
  RA.map((entry) => entry.expressionDoi),
  (listOfExpressionDois) => listOfExpressionDois.includes(expressionDoi),
);

type SelectListContainingExpression = (userId: UserId) => (expressionDoi: ExpressionDoi) => O.Option<List>;

export const selectListContainingExpression = (
  readModel: ReadModel,
): SelectListContainingExpression => (
  userId,
) => (
  expressionDoi,
) => pipe(
  readModel,
  R.filter((listState) => LOID.eqListOwnerId.equals(listState.ownerId, LOID.fromUserId(userId))),
  R.filter(isListContaining(expressionDoi)),
  (result) => Object.values(result),
  RA.head,
);
