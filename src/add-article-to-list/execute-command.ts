import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import {
  articleAddedToList,
  DomainEvent, isArticleAddedToListEvent, RuntimeGeneratedEvent,
} from '../domain-events';
import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';

export type Command = {
  articleId: Doi,
  listId: ListId,
};

type ExecuteCommand = (command: Command)
=> (events: ReadonlyArray<DomainEvent>)
=> E.Either<unknown, ReadonlyArray<RuntimeGeneratedEvent>>;

export const executeCommand: ExecuteCommand = (command) => (events) => pipe(
  events,
  RA.filter(isArticleAddedToListEvent),
  RA.some((event) => event.articleId.value === command.articleId.value && event.listId === command.listId),
  B.fold(
    () => E.right([articleAddedToList(command.articleId, command.listId)]),
    () => E.right([]),
  ),
);
