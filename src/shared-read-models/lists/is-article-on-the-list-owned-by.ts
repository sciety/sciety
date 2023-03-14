import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { IsArticleOnTheListOwnedBy } from '../../shared-ports';
import * as LOID from '../../types/list-owner-id';

export const isArticleOnTheListOwnedBy = (
  readModel: ReadModel,
): IsArticleOnTheListOwnedBy => (
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
