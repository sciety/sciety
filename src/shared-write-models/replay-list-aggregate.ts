import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ListAggregate } from './list-aggregate';
import {
  ArticleAddedToListEvent, ArticleRemovedFromListEvent, DomainEvent, isArticleAddedToListEvent,
  isArticleRemovedFromListEvent, isListCreatedEvent,
} from '../domain-events';
import { ListCreatedEvent } from '../domain-events/list-created-event';
import { eqDoi } from '../types/doi';
import { ErrorMessage, toErrorMessage } from '../types/error-message';
import { ListId } from '../types/list-id';

type ReplayListAggregate = (listId: ListId)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ListAggregate>;

type RelevantEvent = ListCreatedEvent | ArticleAddedToListEvent | ArticleRemovedFromListEvent;

const isARelevantEventForTheWriteModel = (event: DomainEvent): event is RelevantEvent => (
  isListCreatedEvent(event)
  || isArticleAddedToListEvent(event)
  || isArticleRemovedFromListEvent(event)
);

const isAnEventOfThisAggregate = (listId: ListId) => (event: RelevantEvent) => event.listId === listId;

export const replayListAggregate: ReplayListAggregate = (listId) => (events) => pipe(
  events,
  RA.filter(isARelevantEventForTheWriteModel),
  RA.filter(isAnEventOfThisAggregate(listId)),
  RA.reduce(E.left(toErrorMessage(`List with list id ${listId} not found`)), (aggregate, event) => {
    switch (event.type) {
      case 'ListCreated':
        return E.right({ articleIds: [], name: event.name });
      case 'ArticleAddedToList':
        return pipe(
          aggregate,
          E.map(({ articleIds, name }) => ({ articleIds: [...articleIds, event.articleId], name })),
        );
      case 'ArticleRemovedFromList':
        return pipe(
          aggregate,
          E.map(({ articleIds, name }) => pipe(
            articleIds,
            RA.filter((articleId) => !eqDoi.equals(articleId, event.articleId)),
            (ids) => ({ articleIds: ids, name }),
          )),
        );
    }
  }),
);
