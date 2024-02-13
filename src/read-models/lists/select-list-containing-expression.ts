import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { ReadModel } from './handle-event';
import * as LOID from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';
import { List } from '../../types/list';
import { ExpressionDoi } from '../../types/expression-doi';

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
  R.filter((listState) => listState.expressionDois.includes(expressionDoi)),
  (result) => Object.values(result),
  RA.head,
);
