import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { constructEvent } from '../../../domain-events';
import { ListResource } from './list-resource';
import { replayListResource } from './replay-list-resource';
import { ResourceAction } from '../resource-action';
import { AddArticleToListCommand } from '../../commands';

const createAppropriateEvents = (command: AddArticleToListCommand) => (listResource: ListResource) => pipe(
  listResource.articleIds,
  RA.some((articleId) => articleId.value === command.articleId.value),
  B.fold(
    () => [constructEvent('ArticleAddedToList')(command)],
    () => [],
  ),
);

export const addArticle: ResourceAction<AddArticleToListCommand> = (command) => (events) => pipe(
  events,
  replayListResource(command.listId),
  E.map(createAppropriateEvents(command)),
);
