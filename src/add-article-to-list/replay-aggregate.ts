import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { ListAggregate } from './list-aggregate';
import {
  ArticleAddedToListEvent, DomainEvent, isArticleAddedToListEvent, isListCreatedEvent,
} from '../domain-events';
import { ListCreatedEvent } from '../domain-events/list-created-event';
import { ListId } from '../types/list-id';

type ReplayAggregate = (listId: ListId) => (events: ReadonlyArray<DomainEvent>) => E.Either<string, ListAggregate>;

type RelevantEvent = ListCreatedEvent | ArticleAddedToListEvent;

const isARelevantEventForTheWriteModel = (event: DomainEvent): event is RelevantEvent => isListCreatedEvent(event)
 || isArticleAddedToListEvent(event);

const isAnEventOfThisAggregate = (listId: ListId) => (event: RelevantEvent) => event.listId === listId;

export const replayAggregate: ReplayAggregate = (listId) => (events) => pipe(
  events,
  RA.filter(isARelevantEventForTheWriteModel),
  RA.filter(isAnEventOfThisAggregate(listId)),
  RA.reduce(E.left(`List with list id ${listId} not found`), (aggregate, event) => {
    switch (event.type) {
      case 'ListCreated':
        return E.right({ articleIds: [] });
      case 'ArticleAddedToList':
        return pipe(
          aggregate,
          E.map(({ articleIds }) => ({ articleIds: [...articleIds, event.articleId] })),
        );
    }
  }),
);
