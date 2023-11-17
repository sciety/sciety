import { pipe } from 'fp-ts/function';
import * as RA from 'fp-ts/ReadonlyArray';
import { ReadModel } from './handle-event.js';
import { isGroupId } from '../../types/list-owner-id.js';
import { List } from '../../types/list.js';

type GetNonEmptyUserLists = () => ReadonlyArray<List>;

export const getNonEmptyUserLists = (
  readModel: ReadModel,
): GetNonEmptyUserLists => () => pipe(
  Object.values(readModel),
  RA.filter((list) => !isGroupId(list.ownerId)),
  RA.filter((list) => list.articleIds.length > 0),
);
