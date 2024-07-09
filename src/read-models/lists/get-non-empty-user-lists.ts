import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel, toList } from './handle-event';
import { List } from './list';
import { isGroupId } from '../../types/list-owner-id';

type GetNonEmptyUserLists = () => ReadonlyArray<List>;

export const getNonEmptyUserLists = (
  readModel: ReadModel,
): GetNonEmptyUserLists => () => pipe(
  Object.values(readModel.byListId),
  RA.filter((list) => !isGroupId(list.ownerId)),
  RA.filter((list) => list.entries.size > 0),
  RA.map(toList),
);
