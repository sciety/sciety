import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { List } from './list';
import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';

const getPromotedListIdsForGroup = (groupId: GroupId) => (index: ReadModel['byPromotingGroupId']): ReadonlyArray<ListId> => pipe(
  index,
  R.lookup(groupId),
  O.match(
    () => [],
    (promotedListIds) => promotedListIds,
  ),
);

const filterOutNonExistentListIds = (index: ReadModel['byListId']) => (listIds: ReadonlyArray<ListId>) => pipe(
  listIds,
  RA.map((listId) => pipe(
    index,
    R.lookup(listId),
  )),
  RA.filter(O.isSome),
);

export const selectAllListsPromotedByGroup = (
  readModel: ReadModel,
) => (
  groupId: GroupId,
): ReadonlyArray<List> => pipe(
  readModel.byPromotingGroupId,
  getPromotedListIdsForGroup(groupId),
  filterOutNonExistentListIds(readModel.byListId),
  RA.map((option) => option.value),
);
