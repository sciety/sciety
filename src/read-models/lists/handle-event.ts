/* eslint-disable no-param-reassign */
import { DomainEvent, isEventOfType } from '../../domain-events';
import { toExpressionDoi } from '../../types/article-id';
import { ExpressionDoi } from '../../types/expression-doi';
import { ListId } from '../../types/list-id';
import { ListOwnerId } from '../../types/list-owner-id';

type ListState = {
  id: ListId,
  ownerId: ListOwnerId,
  articleIds: Array<ExpressionDoi>,
  updatedAt: Date,
  name: string,
  description: string,
};
export type ReadModel = Record<ListId, ListState>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('ListCreated')(event)) {
    readmodel[event.listId] = {
      id: event.listId,
      ownerId: event.ownerId,
      articleIds: [],
      updatedAt: event.date,
      name: event.name,
      description: event.description,
    };
  } else if (isEventOfType('ArticleAddedToList')(event)) {
    readmodel[event.listId].articleIds.push(toExpressionDoi(event.articleId));
    readmodel[event.listId].updatedAt = event.date;
  } else if (isEventOfType('ArticleRemovedFromList')(event)) {
    readmodel[event.listId].articleIds = readmodel[event.listId].articleIds.filter(
      (id) => id !== toExpressionDoi(event.articleId),
    );
    readmodel[event.listId].updatedAt = event.date;
  } else if (isEventOfType('ListNameEdited')(event)) {
    readmodel[event.listId].name = event.name;
    readmodel[event.listId].updatedAt = event.date;
  } else if (isEventOfType('ListDescriptionEdited')(event)) {
    readmodel[event.listId].description = event.description;
    readmodel[event.listId].updatedAt = event.date;
  }
  return readmodel;
};
