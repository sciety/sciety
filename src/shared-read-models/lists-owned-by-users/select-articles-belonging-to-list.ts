import * as E from 'fp-ts/Either';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { ReadModel } from './handle-event';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { ListId } from '../../types/list-id';

type SelectArticlesBelongingToList = (listId: ListId)
=> E.Either<DE.DataError, ReadonlyArray<Doi>>;

export const selectArticlesBelongingToList = (
  readModel: ReadModel,
): SelectArticlesBelongingToList => (listId) => pipe(
  readModel,
  R.lookup(listId),
  E.fromOption(() => DE.notFound),
  E.map(() => []),
);
