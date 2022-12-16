/* eslint-disable no-param-reassign */
import {
  DomainEvent,
  isEventOfType,
} from '../../domain-events';
import { ListId } from '../../types/list-id';
import { ListOwnerId } from '../../types/list-owner-id';

export type ListState = {
  listId: ListId,
  ownerId: ListOwnerId,
  articleIds: Array<string>,
  lastUpdated: Date,
  name: string,
  description: string,
};
export type ReadModel = Record<ListId, ListState>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isEventOfType('ListCreated')(event)) {
    readmodel[event.listId] = {
      listId: event.listId,
      ownerId: event.ownerId,
      articleIds: [],
      lastUpdated: event.date,
      name: event.name,
      description: event.description,
    };
  } else if (isEventOfType('ArticleAddedToList')(event)) {
    readmodel[event.listId].articleIds.push(event.articleId.value);
    readmodel[event.listId].lastUpdated = event.date;
  } else if (isEventOfType('ArticleRemovedFromList')(event)) {
    readmodel[event.listId].articleIds = readmodel[event.listId].articleIds.filter(
      (id) => id !== event.articleId.value,
    );
    readmodel[event.listId].lastUpdated = event.date;
  } else if (isEventOfType('ListNameEdited')(event)) {
    readmodel[event.listId].name = event.name;
    readmodel[event.listId].lastUpdated = event.date;
  } else if (isEventOfType('ListDescriptionEdited')(event)) {
    readmodel[event.listId].description = event.description;
    readmodel[event.listId].lastUpdated = event.date;
  }
  return readmodel;
};
