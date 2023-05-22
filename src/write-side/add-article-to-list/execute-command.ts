import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import { constructEvent, DomainEvent } from '../../domain-events';
import { ListResource } from '../resources/list/list-resource';
import { Doi } from '../../types/doi';
import { ListId } from '../../types/list-id';

type Command = {
  articleId: Doi,
  listId: ListId,
};

const createAppropriateEvents = (command: Command) => (listResource: ListResource) => pipe(
  listResource.articleIds,
  RA.some((articleId) => articleId.value === command.articleId.value),
  B.fold(
    () => [constructEvent('ArticleAddedToList')({ articleId: command.articleId, listId: command.listId })],
    () => [],
  ),
);

type ExecuteCommand = (command: Command)
=> (listResource: ListResource)
=> ReadonlyArray<DomainEvent>;

export const executeCommand: ExecuteCommand = (command) => (listResource) => pipe(
  listResource,
  createAppropriateEvents(command),
);
