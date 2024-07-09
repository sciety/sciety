import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel, toList } from './handle-event';
import { List } from './list';
import { ListId } from '../../types/list-id';

type LookupList = (listId: ListId) => O.Option<List>;

export const lookupList = (readModel: ReadModel): LookupList => (listId: ListId) => pipe(
  readModel.byListId,
  R.lookup(listId),
  O.map(toList),
);
