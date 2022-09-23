import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { ListAggregate } from './list-aggregate';
import {
  articleAddedToList, RuntimeGeneratedEvent,
} from '../domain-events';
import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';

export type Command = {
  articleId: Doi,
  listId: ListId,
};

const createAppropriateEvents = (command: Command, date: Date) => (listAggregate: ListAggregate) => pipe(
  listAggregate.articleIds,
  RA.some((articleId) => articleId.value === command.articleId.value),
  B.fold(
    () => [articleAddedToList(command.articleId, command.listId, date)],
    () => [],
  ),
);

type ExecuteCommand = (command: Command, date?: Date)
=> (listAggregate: ListAggregate)
=> ReadonlyArray<RuntimeGeneratedEvent>;

export const executeCommand: ExecuteCommand = (command, date = new Date()) => (listAggregate) => pipe(
  listAggregate,
  createAppropriateEvents(command, date),
);
