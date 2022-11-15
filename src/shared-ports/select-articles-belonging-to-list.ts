import * as E from 'fp-ts/Either';
import * as DE from '../types/data-error';
import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';

export type SelectArticlesBelongingToList = (listId: ListId)
=> E.Either<DE.DataError, ReadonlyArray<Doi>>;
