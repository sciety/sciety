import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { DomainEvent, isArticleAddedToListEvent, isListCreatedEvent } from '../../domain-events';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';

type SelectArticlesBelongingToList = (listId: string)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<DE.DataError, ReadonlyArray<Doi>>;

export const selectArticlesBelongingToList: SelectArticlesBelongingToList = (listId) => (events) => pipe(
  events,
  RA.filter(isListCreatedEvent),
  RA.some((event) => event.listId === listId),
  B.fold(
    () => E.left(DE.notFound),
    () => pipe(
      events,
      RA.filter(isArticleAddedToListEvent),
      RA.filter((event) => event.listId === listId),
      RA.map((event) => event.articleId),
      RA.reverse,
      E.right,
    ),
  ),
);
