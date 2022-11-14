import * as E from 'fp-ts/Either';
import { ReadModel } from './handle-event';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { ListId } from '../../types/list-id';

type SelectArticlesBelongingToList = (listId: ListId)
=> E.Either<DE.DataError, ReadonlyArray<Doi>>;

export const selectArticlesBelongingToList = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readModel: ReadModel,
): SelectArticlesBelongingToList => () => E.left(DE.notFound);
