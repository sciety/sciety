import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructEvent } from '../../domain-events';
import { ListResource } from '../resources/list/list-resource';
import { replayListResource } from '../resources/list/replay-list-resource';
import { ResourceAction } from '../resources/resource-action';
import { AddArticleToListCommand } from '../commands';

const createAppropriateEvents = (command: AddArticleToListCommand) => (listResource: ListResource) => pipe(
  listResource.articleIds,
  RA.some((articleId) => articleId.value === command.articleId.value),
  B.fold(
    () => [constructEvent('ArticleAddedToList')({ articleId: command.articleId, listId: command.listId })],
    () => [],
  ),
);

export const executeCommand: ResourceAction<AddArticleToListCommand> = (command) => (events) => pipe(
  events,
  replayListResource(command.listId),
  E.map(createAppropriateEvents(command)),
);
