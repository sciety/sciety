import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RM from 'fp-ts/ReadonlyMap';
import { pipe } from 'fp-ts/function';
import { Eq as stringEq } from 'fp-ts/string';
import { ReadModel } from './handle-event';
import { GroupId } from '../../types/group-id';
import { ListId } from '../../types/list-id';

type PromotedList = {
  id: ListId,
};

export const selectAllListsPromotedByGroup = (
  readModel: ReadModel,
) => (
  groupId: GroupId,
): ReadonlyArray<PromotedList> => pipe(
  readModel,
  RM.lookup(stringEq)(groupId),
  O.map(RA.map((listId) => ({
    id: listId,
  }))),
  O.getOrElseW(() => []),
);
