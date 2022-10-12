import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { articleRemovedFromList, DomainEvent } from '../domain-events';
import { ListAggregate } from '../shared-write-models/list-aggregate';
import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';

type Command = {
  articleId: Doi,
  listId: ListId,
};

type ExecuteCommand = (
  command: { listId: ListId, articleId: Doi },
  date?: Date,
) => (
  aggregate: ListAggregate,
) => ReadonlyArray<DomainEvent>;

const createAppropriateEvents = (command: Command, date: Date) => (listAggregate: ListAggregate) => pipe(
  listAggregate.articleIds,
  RA.some((articleId) => articleId.value === command.articleId.value),
  B.fold(
    () => [],
    () => [articleRemovedFromList(command.articleId, command.listId, date)],
  ),
);

export const executeCommand: ExecuteCommand = (command, date = new Date()) => (listAggregate) => pipe(
  listAggregate,
  createAppropriateEvents(command, date),
);
