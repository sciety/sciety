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
import { ExpressionDoi } from '../../../types/expression-doi';
import { ListId } from '../../../types/list-id';
import { RemoveArticleFromListCommand } from '../../commands';
import { ResourceAction } from '../resource-action';

type ListWriteModel = boolean;

type RelevantEvent = ReturnType<typeof filterToEventsRelevantToWriteModel>[number];

const filterToEventsRelevantToWriteModel = filterByName(['ExpressionAddedToList', 'ArticleRemovedFromList']);

const isAnEventOfThisList = (listId: ListId, expressionDoi: ExpressionDoi) => (event: RelevantEvent) => (
  event.listId === listId && (
    (event.type === 'ExpressionAddedToList' && event.expressionDoi === expressionDoi)
    || (event.type === 'ArticleRemovedFromList' && event.articleId.value === expressionDoi)
  )
);

const updateListWriteModel = (resource: ListWriteModel, event: DomainEvent) => {
  if (isEventOfType('ExpressionAddedToList')(event)) {
    return true;
  }
  if (isEventOfType('ArticleRemovedFromList')(event)) {
    return false;
  }
  return resource;
};

const createAppropriateEvents = (command: RemoveArticleFromListCommand) => (listResource: ListWriteModel) => pipe(
  listResource,
  B.fold(
    () => [],
    () => [constructEvent('ArticleRemovedFromList')({
      articleId: new ArticleId(command.expressionDoi),
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
    RA.filter(isAnEventOfThisList(command.listId, command.expressionDoi)),
  )),
  E.filterOrElse(
    RA.isNonEmpty,
    () => toErrorMessage('article-not-found'),
  ),
  E.map(RA.reduce(false, updateListWriteModel)),
  E.map(createAppropriateEvents(command)),
);
