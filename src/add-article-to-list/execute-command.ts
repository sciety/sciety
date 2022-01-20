import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import {
  articleAddedToList,
  DomainEvent, isArticleAddedToListEvent, isListCreatedEvent, RuntimeGeneratedEvent,
} from '../domain-events';
import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';

export type Command = {
  articleId: Doi,
  listId: ListId,
};

const createAppropriateEvents = (command: Command) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isArticleAddedToListEvent),
  RA.some((event) => event.articleId.value === command.articleId.value && event.listId === command.listId),
  B.fold(
    () => [articleAddedToList(command.articleId, command.listId)],
    () => [],
  ),
);

const confirmListExists = (listId: ListId) => (events: ReadonlyArray<DomainEvent>) => pipe(
  events,
  RA.filter(isListCreatedEvent),
  RA.some((event) => event.listId === listId),
  B.fold(
    () => E.left(`List "${listId}" not found`),
    () => E.right(undefined),
  ),
);

type ExecuteCommand = (command: Command)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<string, ReadonlyArray<RuntimeGeneratedEvent>>;

export const executeCommand: ExecuteCommand = (command) => (events) => pipe(
  events,
  E.right,
  E.chainFirst(confirmListExists(command.listId)),
  E.map(createAppropriateEvents(command)),
);
