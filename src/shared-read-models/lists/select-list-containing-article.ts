import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { ReadModel } from './handle-event';
import * as LOID from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';
import { Doi } from '../../types/doi';
import { List } from './list';

type SelectListContainingArticle = (userId: UserId) => (articleId: Doi) => O.Option<List>;

export const selectListContainingArticle = (
  readModel: ReadModel,
): SelectListContainingArticle => (
  userId,
) => (
  articleId,
) => pipe(
  readModel,
  R.filter((listState) => LOID.eqListOwnerId.equals(listState.ownerId, LOID.fromUserId(userId))),
  R.filter((listState) => listState.articleIds.includes(articleId.value)),
  (result) => Object.values(result),
  RA.head,
);
