import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import { GetList } from '../../shared-ports';
import { ListId } from '../../types/list-id';

export const getList = (readModel: ReadModel): GetList => (listId: ListId) => pipe(
  readModel,
  R.lookup(listId),
  O.map((list) => ({
    ...list,
    articleIds: A.reverse(list.articleIds),
  })),
);
