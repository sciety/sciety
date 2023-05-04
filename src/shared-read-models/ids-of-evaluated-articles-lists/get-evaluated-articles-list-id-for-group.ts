import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';

export type GetEvaluatedArticlesListIdForGroup = (groupId: GroupId) => O.Option<ListId>;

export const getEvaluatedArticlesListIdForGroup = (
  readModel: ReadModel,
): GetEvaluatedArticlesListIdForGroup => (
  groupId,
) => pipe(
  readModel,
  R.lookup(groupId),
);
