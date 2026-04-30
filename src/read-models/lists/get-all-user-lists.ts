import * as D from 'fp-ts/Date';
import * as Ord from 'fp-ts/Ord';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { List } from './list';
import { isGroupId } from '../../types/list-owner-id';

type GetAllUserLists = () => ReadonlyArray<List>;

export const byMostRecentlyUpdated: Ord.Ord<List> = pipe(
  D.Ord,
  Ord.reverse,
  Ord.contramap((entry) => entry.updatedAt),
);

export const getAllUserLists = (
  readModel: ReadModel,
): GetAllUserLists => () => pipe(
  Object.values(readModel.byListId),
  RA.filter((list) => !isGroupId(list.ownerId)),
);
