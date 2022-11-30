import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ListResource } from './list-resource';
import {
  ArticleAddedToListEvent, ArticleRemovedFromListEvent, DomainEvent, isArticleAddedToListEvent,
  isArticleRemovedFromListEvent, isListCreatedEvent, isListNameEditedEvent, ListNameEditedEvent,
} from '../domain-events';
import { ListCreatedEvent } from '../domain-events/list-created-event';
import { eqDoi } from '../types/doi';
import { ErrorMessage, toErrorMessage } from '../types/error-message';
import { ListId } from '../types/list-id';

type ReplayListResource = (listId: ListId)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ListResource>;

type RelevantEvent = ListCreatedEvent | ArticleAddedToListEvent | ArticleRemovedFromListEvent | ListNameEditedEvent;

const isARelevantEventForTheWriteModel = (event: DomainEvent): event is RelevantEvent => (
  isListCreatedEvent(event)
  || isArticleAddedToListEvent(event)
  || isArticleRemovedFromListEvent(event)
  || isListNameEditedEvent(event)
);

const isAnEventOfThisResource = (listId: ListId) => (event: RelevantEvent) => event.listId === listId;

export const replayListResource: ReplayListResource = (listId) => (events) => pipe(
  events,
  RA.filter(isARelevantEventForTheWriteModel),
  RA.filter(isAnEventOfThisResource(listId)),
  RA.reduce(E.left(toErrorMessage(`List with list id ${listId} not found`)), (resource, event) => {
    switch (event.type) {
      case 'ListCreated':
        return E.right({ articleIds: [], name: event.name });
      case 'ArticleAddedToList':
        return pipe(
          resource,
          E.map(({ articleIds, name }) => ({ articleIds: [...articleIds, event.articleId], name })),
        );
      case 'ArticleRemovedFromList':
        return pipe(
          resource,
          E.map(({ articleIds, name }) => pipe(
            articleIds,
            RA.filter((articleId) => !eqDoi.equals(articleId, event.articleId)),
            (ids) => ({ articleIds: ids, name }),
          )),
        );
      case 'ListNameEdited':
        return pipe(
          resource,
          E.map(({ articleIds }) => ({ articleIds, name: event.name })),
        );
    }
  }),
);
