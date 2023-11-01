import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import {
  EventOfType, isEventOfType,
  DomainEvent,
} from '../../../domain-events';
import { ListResource } from './list-resource';
import { eqArticleId } from '../../../types/article-id';
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

const updateResource = (resource: E.Either<ErrorMessage, ListResource>, event: DomainEvent) => {
  if (isEventOfType('ListCreated')(event)) {
    return E.right({ articles: [], name: event.name, description: event.description } satisfies ListResource);
  }
  if (isEventOfType('ArticleAddedToList')(event)) {
    pipe(
      resource,
      E.map((listResource) => {
        listResource.articles.push({ articleId: event.articleId, annotated: false } satisfies ListResource['articles'][number]);
        return undefined;
      }),
    );
  }
  if (isEventOfType('ArticleRemovedFromList')(event)) {
    return pipe(
      resource,
      E.map((listResource) => pipe(
        listResource.articles,
        A.filter((article) => !eqArticleId.equals(article.articleId, event.articleId)),
        (ids) => ({ ...listResource, articles: ids } satisfies ListResource),
      )),
    );
  }
  if (isEventOfType('ListNameEdited')(event)) {
    return pipe(
      resource,
      E.map((listResource) => ({ ...listResource, name: event.name } satisfies ListResource)),
    );
  }
  if (isEventOfType('ListDescriptionEdited')(event)) {
    return pipe(
      resource,
      E.map((listResource) => ({ ...listResource, description: event.description } satisfies ListResource)),
    );
  }
  return resource;
};

export const replayListResource: ReplayListResource = (listId) => (events) => pipe(
  events,
  RA.filter(isARelevantEventForTheWriteModel),
  RA.filter(isAnEventOfThisResource(listId)),
  RA.reduce(E.left(toErrorMessage(`List with list id ${listId} not found`)), updateResource),
);
