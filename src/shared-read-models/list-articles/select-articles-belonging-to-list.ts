import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import {
  ArticleAddedToListEvent,
  ArticleRemovedFromListEvent,
  DomainEvent,
  isArticleAddedToListEvent,
  isArticleRemovedFromListEvent,
  isListCreatedEvent,
} from '../../domain-events';
import * as DE from '../../types/data-error';
import { Doi, eqDoi } from '../../types/doi';
import { ListId } from '../../types/list-id';

type SelectArticlesBelongingToList = (listId: ListId)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<DE.DataError, ReadonlyArray<Doi>>;

const calculateListContents = (
  state: Array<Doi>,
  event: ArticleAddedToListEvent | ArticleRemovedFromListEvent,
): Array<Doi> => {
  if (isArticleAddedToListEvent(event)) {
    state.push(event.articleId);
  }
  if (isArticleRemovedFromListEvent(event)) {
    // eslint-disable-next-line no-loops/no-loops
    for (let indexOfArticle = 0; indexOfArticle < state.length; indexOfArticle += 1) {
      if (eqDoi.equals(event.articleId, state[indexOfArticle])) {
        state.splice(indexOfArticle, 1);
        break;
      }
    }
  }
  return state;
};

const isListMembershipEvent = (
  event: DomainEvent,
): event is ArticleAddedToListEvent | ArticleRemovedFromListEvent => (
  isArticleAddedToListEvent(event) || isArticleRemovedFromListEvent(event)
);

export const selectArticlesBelongingToList: SelectArticlesBelongingToList = (listId) => (events) => pipe(
  events,
  RA.filter(isListCreatedEvent),
  RA.some((event) => event.listId === listId),
  B.fold(
    () => E.left(DE.notFound),
    () => pipe(
      events,
      RA.filter(isListMembershipEvent),
      RA.filter((event) => event.listId === listId),
      RA.reduce([], calculateListContents),
      RA.reverse,
      E.right,
    ),
  ),
);
