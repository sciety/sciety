import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { isEventOfType } from '../../../domain-events/domain-event';
import { ListResource } from './list-resource';
import {
  ArticleAddedToListEvent, ArticleRemovedFromListEvent, DomainEvent,
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
  isEventOfType('ListCreated')(event)
  || isEventOfType('ArticleAddedToList')(event)
  || isEventOfType('ArticleRemovedFromList')(event)
  || isEventOfType('ListNameEdited')(event)
  || isEventOfType('ListDescriptionEdited')(event)
);

const isAnEventOfThisResource = (listId: ListId) => (event: RelevantEvent) => event.listId === listId;

export const replayListResource: ReplayListResource = (listId) => (events) => pipe(
  events,
  RA.filter(isARelevantEventForTheWriteModel),
  RA.filter(isAnEventOfThisResource(listId)),
  RA.reduce(E.left(toErrorMessage(`List with list id ${listId} not found`)), (resource, event) => {
    if (isEventOfType('ListCreated')(event)) {
      return E.right({ articleIds: [], name: event.name, description: event.description });
    }
    if (isEventOfType('ArticleAddedToList')(event)) {
      return pipe(
        resource,
        E.map((listResource) => ({
          ...listResource,
          articleIds: [...listResource.articleIds, event.articleId],
        })),
      );
    }
    if (isEventOfType('ArticleRemovedFromList')(event)) {
      return pipe(
        resource,
        E.map((listResource) => pipe(
          listResource.articleIds,
          RA.filter((articleId) => !eqDoi.equals(articleId, event.articleId)),
          (ids) => ({ ...listResource, articleIds: ids }),
        )),
      );
    }
    if (isEventOfType('ListNameEdited')(event)) {
      return pipe(
        resource,
        E.map((listResource) => ({ ...listResource, name: event.name })),
      );
    }
    if (isEventOfType('ListDescriptionEdited')(event)) {
      return pipe(
        resource,
        E.map((listResource) => ({ ...listResource, description: event.description })),
      );
    }
    return resource;
  }),
);
