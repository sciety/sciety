import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { Doi } from '../../types/doi';
import { ListId } from '../../types/list-id';
import * as LOID from '../../types/list-owner-id';
import { UserId } from '../../types/user-id';

export const isArticleOnTheListOwnedBy = (
  readModel: ReadModel,
) => (userId: UserId) => (articleId: Doi): O.Option<ListId> => pipe(
  readModel,
  R.filter((listState) => LOID.eqListOwnerId.equals(listState.ownerId, LOID.fromUserId(userId))),
  R.filter((listState) => listState.articleIds.includes(articleId.value)),
  (result) => Object.values(result),
  RA.head,
  O.map((list) => list.listId),
);
