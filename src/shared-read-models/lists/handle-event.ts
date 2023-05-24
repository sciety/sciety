import { isEventOfType } from '../../domain-events/domain-event';
/* eslint-disable no-param-reassign */
import {
  DomainEvent,
  isListCreatedEvent,
} from '../../domain-events';
import { ListId } from '../../types/list-id';
import { ListOwnerId } from '../../types/list-owner-id';

type ListState = {
  id: ListId,
  ownerId: ListOwnerId,
  articleIds: Array<string>,
  updatedAt: Date,
  name: string,
  description: string,
};
export type ReadModel = Record<ListId, ListState>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isListCreatedEvent(event)) {
    readmodel[event.listId] = {
      id: event.listId,
      ownerId: event.ownerId,
      articleIds: [],
      updatedAt: event.date,
      name: event.name,
      description: event.description,
    };
  } else if (isEventOfType('ArticleAddedToList')(event)) {
    readmodel[event.listId].articleIds.push(event.articleId.value);
    readmodel[event.listId].updatedAt = event.date;
  } else if (isEventOfType('ArticleRemovedFromList')(event)) {
    readmodel[event.listId].articleIds = readmodel[event.listId].articleIds.filter(
      (id) => id !== event.articleId.value,
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
