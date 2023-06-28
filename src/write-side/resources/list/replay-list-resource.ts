import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import {
  EventOfType, isEventOfType,
  DomainEvent,
} from '../../../domain-events';
import { ListResource } from './list-resource';
import { eqDoi } from '../../../types/doi';
import { ErrorMessage, toErrorMessage } from '../../../types/error-message';
import { ListId } from '../../../types/list-id';

type ReplayListResource = (listId: ListId)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<ErrorMessage, ListResource>;

type RelevantEvent =
| EventOfType<'ListCreated'>
| EventOfType<'ArticleAddedToList'>
| EventOfType<'ArticleRemovedFromList'>
| EventOfType<'ListNameEdited'>
| EventOfType<'ListDescriptionEdited'>;

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
      pipe(
        resource,
        E.map((listResource) => {
          listResource.articleIds.push(event.articleId);
          return undefined;
        }),
      );
    }
    if (isEventOfType('ArticleRemovedFromList')(event)) {
      return pipe(
        resource,
        E.map((listResource) => pipe(
          listResource.articleIds,
          A.filter((articleId) => !eqDoi.equals(articleId, event.articleId)),
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
