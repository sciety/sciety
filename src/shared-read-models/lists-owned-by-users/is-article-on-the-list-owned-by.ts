import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { Doi } from '../../types/doi';
import * as LOID from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';

type IsArticleOnTheListOwnedBy = (userId: UserId) => (articleId: Doi) => boolean;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  R.isEmpty,
  (b) => !b,
);
