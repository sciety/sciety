import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { pipe } from 'fp-ts/function';
import * as E from 'fp-ts/Either';
import { toHtmlFragment } from '../../../types/html-fragment';
import { constructEvent } from '../../../domain-events';
import { ListResource } from './list-resource';
import { replayListResource } from './replay-list-resource';
import { ResourceAction } from '../resource-action';
import { AddArticleToListCommand } from '../../commands';

const constructEvents = (command: AddArticleToListCommand) => (
  command.annotation === undefined
    ? [
      constructEvent('ArticleAddedToList')({
        articleId: command.articleId,
        listId: command.listId,
      }),
    ]
    : [
      constructEvent('ArticleAddedToList')({
        articleId: command.articleId,
        listId: command.listId,
      }),
      constructEvent('AnnotationCreated')({
        target: {
          articleId: command.articleId,
          listId: command.listId,
        },
        content: toHtmlFragment(command.annotation),
      }),
    ]
);

const createAppropriateEvents = (command: AddArticleToListCommand) => (listResource: ListResource) => pipe(
  listResource.articleIds,
  RA.some((articleId) => articleId.value === command.articleId.value),
  B.fold(
    () => constructEvents(command),
    () => [],
  ),
);

export const addArticle: ResourceAction<AddArticleToListCommand> = (command) => (events) => pipe(
  events,
  replayListResource(command.listId),
  E.map(createAppropriateEvents(command)),
);
