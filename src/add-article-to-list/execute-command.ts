import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import {
  articleAddedToList, DomainEvent,
} from '../domain-events';
import { ListResource } from '../shared-write-models/list-resource';
import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';

type Command = {
  articleId: Doi,
  listId: ListId,
};

const createAppropriateEvents = (command: Command) => (listAggregate: ListResource) => pipe(
  listAggregate.articleIds,
  RA.some((articleId) => articleId.value === command.articleId.value),
  B.fold(
    () => [articleAddedToList(command.articleId, command.listId)],
    () => [],
  ),
);

type ExecuteCommand = (command: Command)
=> (listAggregate: ListResource)
=> ReadonlyArray<DomainEvent>;

export const executeCommand: ExecuteCommand = (command) => (listAggregate) => pipe(
  listAggregate,
  createAppropriateEvents(command),
);
