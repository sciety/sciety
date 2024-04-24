import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { List } from './list';
import { GroupId } from '../../types/group-id';

export const selectAllListsPromotedByGroup = (
  readModel: ReadModel,
) => (
  groupId: GroupId,
): ReadonlyArray<List> => pipe(
  readModel.byPromotingGroupId,
  R.lookup(groupId),
  O.match(
    () => [],
    (promotedListIds) => promotedListIds,
  ),
  RA.map((listId) => pipe(
    readModel.byListId,
    R.lookup(listId),
  )),
  RA.filter(O.isSome),
  RA.map((option) => option.value),
);
