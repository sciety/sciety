import * as E from 'fp-ts/Either';
import * as RA from 'fp-ts/ReadonlyArray';
import * as B from 'fp-ts/boolean';
import { flow, pipe } from 'fp-ts/function';
import { doesListExist } from './does-list-exist';
import {
  constructEvent,
  isEventOfType,
  DomainEvent,
  filterByName,
} from '../../../domain-events';
import { ArticleId } from '../../../types/article-id';
import { toErrorMessage } from '../../../types/error-message';
import { ListId } from '../../../types/list-id';
import { RemoveArticleFromListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

type ListWriteModel = {
  articles: Array<ArticleId>,
};

type RelevantEvent = ReturnType<typeof filterToEventsRelevantToWriteModel>[number];

const filterToEventsRelevantToWriteModel = filterByName(['ArticleAddedToList', 'ArticleRemovedFromList']);

const isAnEventOfThisList = (listId: ListId) => (event: RelevantEvent) => event.listId === listId;

const updateListWriteModel = (
  command: RemoveArticleFromListCommand,
) => (resource: ListWriteModel, event: DomainEvent) => {
  if (isEventOfType('ArticleAddedToList')(event)) {
    if (event.articleId.value === command.articleId) {
      pipe(
        resource,
        (listResource) => {
          listResource.articles.push(event.articleId);
          return undefined;
        },
      );
    }
  }
  if (isEventOfType('ArticleRemovedFromList')(event)) {
    if (event.articleId.value === command.articleId) {
      return pipe(
        resource,
        () => ({ articles: [] }),
      );
    }
  }
  return resource;
};

const createAppropriateEvents = (command: RemoveArticleFromListCommand) => (listResource: ListWriteModel) => pipe(
  listResource.articles,
  RA.some((article) => article.value === command.articleId),
  B.fold(
    () => [],
    () => [constructEvent('ArticleRemovedFromList')({
      articleId: new ArticleId(command.articleId),
      listId: command.listId,
    })],
  ),
);

export const removeArticle: ResourceAction<RemoveArticleFromListCommand> = (command) => (events) => pipe(
  events,
  E.right,
  E.filterOrElse(
    doesListExist(command.listId),
    () => toErrorMessage('list-not-found'),
  ),
  E.map(flow(
    filterToEventsRelevantToWriteModel,
    RA.filter(isAnEventOfThisList(command.listId)),
    RA.reduce({ articles: [] }, updateListWriteModel(command)),
  )),
  E.map(createAppropriateEvents(command)),
);
