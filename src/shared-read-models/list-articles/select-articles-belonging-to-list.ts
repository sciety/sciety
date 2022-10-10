import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import {
  ArticleAddedToListEvent, DomainEvent, isArticleAddedToListEvent, isListCreatedEvent,
} from '../../domain-events';
import * as DE from '../../types/data-error';
import { Doi } from '../../types/doi';
import { ListId } from '../../types/list-id';

type SelectArticlesBelongingToList = (listId: ListId)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<DE.DataError, ReadonlyArray<Doi>>;

const calculateListContents = (state: Array<Doi>, event: ArticleAddedToListEvent): Array<Doi> => {
  state.push(event.articleId);
  return state;
};

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
      RA.reduce([], calculateListContents),
      RA.reverse,
      E.right,
    ),
  ),
);
