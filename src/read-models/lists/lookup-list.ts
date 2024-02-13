import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { ListId } from '../../types/list-id';
import { List } from '../../types/list';

type LookupList = (listId: ListId) => O.Option<List>;

export const lookupList = (readModel: ReadModel): LookupList => (listId: ListId) => pipe(
  readModel,
  R.lookup(listId),
  O.map((list) => ({
    ...list,
    articleIds: list.expressionDois,
  })),
);
