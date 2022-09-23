import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { ListAggregate } from './list-aggregate';
import { DomainEvent, isArticleAddedToListEvent, isListCreatedEvent } from '../domain-events';
import { ListId } from '../types/list-id';

const listAggregateByListId = (listId: ListId) => (events: ReadonlyArray<DomainEvent>): ListAggregate => pipe(
  events,
  RA.filter(isArticleAddedToListEvent),
  RA.filter((event) => event.listId === listId),
  RA.map((event) => event.articleId),
  (articleIds) => ({ articleIds }),
);

type ReplayAggregate = (listId: ListId) => (events: ReadonlyArray<DomainEvent>) => E.Either<string, ListAggregate>;

export const replayAggregate: ReplayAggregate = (listId) => (events) => pipe(
  events,
  RA.filter(isListCreatedEvent),
  RA.some((event) => event.listId === listId),
  B.fold(
    () => E.left(`List "${listId}" not found`),
    () => E.right(undefined),
  ),
  E.map(() => listAggregateByListId(listId)(events)),
);
