import * as E from 'fp-ts/Either';
import * as R from 'fp-ts/Record';
import { pipe } from 'fp-ts/function';
import { DomainEvent } from '../../domain-events';
import { lists } from '../../ncrc-featured-articles-page/lists';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';

type SelectArticlesBelongingToList = (listId: string)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<DE.DataError, ReadonlyArray<Doi>>;

export const selectArticlesBelongingToList: SelectArticlesBelongingToList = (listId) => () => pipe(
  lists,
  R.lookup(listId),
  E.fromOption(() => DE.notFound),
);
