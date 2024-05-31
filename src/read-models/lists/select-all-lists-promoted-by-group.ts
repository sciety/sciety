import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { List } from './list';
import { GroupId } from '../../types/group-id';

export const selectAllListsPromotedByGroup = (readModel: ReadModel) => (groupId: GroupId): ReadonlyArray<List> => pipe(
  readModel.byPromotingGroupId,
  R.lookup(groupId),
  O.match(
    () => [],
    (promotedListIds) => promotedListIds,
  ),
);
