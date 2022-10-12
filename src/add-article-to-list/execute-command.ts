import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import {
  articleAddedToList, RuntimeGeneratedEvent,
} from '../domain-events';
import { ListAggregate } from '../shared-write-models/list-aggregate';
import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';

type Command = {
  articleId: Doi,
  listId: ListId,
};

const createAppropriateEvents = (command: Command) => (listAggregate: ListAggregate) => pipe(
  listAggregate.articleIds,
  RA.some((articleId) => articleId.value === command.articleId.value),
  B.fold(
    () => [articleAddedToList(command.articleId, command.listId)],
    () => [],
  ),
);

type ExecuteCommand = (command: Command)
=> (listAggregate: ListAggregate)
=> ReadonlyArray<RuntimeGeneratedEvent>;

export const executeCommand: ExecuteCommand = (command) => (listAggregate) => pipe(
  listAggregate,
  createAppropriateEvents(command),
);
