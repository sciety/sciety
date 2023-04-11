import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ListResource } from './list-resource';
import {
  ArticleAddedToListEvent, ArticleRemovedFromListEvent, DomainEvent, isArticleAddedToListEvent,
  isArticleRemovedFromListEvent, isListCreatedEvent, isListDescriptionEditedEvent, isListNameEditedEvent,
  ListCreatedEvent, ListDescriptionEditedEvent, ListNameEditedEvent,
} from '../../../domain-events';
import { eqDoi } from '../../../types/doi';
import { ErrorMessage, toErrorMessage } from '../../../types/error-message';
import { ListId } from '../../../types/list-id';

type ReplayListResource = (listId: ListId)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ListResource>;

type RelevantEvent =
| ListCreatedEvent
| ArticleAddedToListEvent
| ArticleRemovedFromListEvent
| ListNameEditedEvent
| ListDescriptionEditedEvent;

const isARelevantEventForTheWriteModel = (event: DomainEvent): event is RelevantEvent => (
  isListCreatedEvent(event)
  || isArticleAddedToListEvent(event)
  || isArticleRemovedFromListEvent(event)
  || isListNameEditedEvent(event)
  || isListDescriptionEditedEvent(event)
);

const isAnEventOfThisResource = (listId: ListId) => (event: RelevantEvent) => event.listId === listId;

export const replayListResource: ReplayListResource = (listId) => (events) => pipe(
  events,
  RA.filter(isARelevantEventForTheWriteModel),
  RA.filter(isAnEventOfThisResource(listId)),
  RA.reduce(E.left(toErrorMessage(`List with list id ${listId} not found`)), (resource, event) => {
    switch (event.type) {
      case 'ListCreated':
        return E.right({ articleIds: [], name: event.name, description: event.description });
      case 'ArticleAddedToList':
        return pipe(
          resource,
          E.map((listResource) => ({
            ...listResource,
            articleIds: [...listResource.articleIds, event.articleId],
          })),
        );
      case 'ArticleRemovedFromList':
        return pipe(
          resource,
          E.map((listResource) => pipe(
            listResource.articleIds,
            RA.filter((articleId) => !eqDoi.equals(articleId, event.articleId)),
            (ids) => ({ ...listResource, articleIds: ids }),
          )),
        );
      case 'ListNameEdited':
        return pipe(
          resource,
          E.map((listResource) => ({ ...listResource, name: event.name })),
        );
      case 'ListDescriptionEdited':
        return pipe(
          resource,
          E.map((listResource) => ({ ...listResource, description: event.description })),
        );
    }
  }),
);
