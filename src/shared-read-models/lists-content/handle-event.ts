/* eslint-disable no-param-reassign */
import { DomainEvent, isArticleAddedToListEvent, isArticleRemovedFromListEvent } from '../../domain-events';
import { isListCreatedEvent } from '../../domain-events/list-created-event';
import { ListId } from '../../types/list-id';
import { ListOwnerId } from '../../types/list-owner-id';

type ListState = {
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
  if (isListCreatedEvent(event)) {
    readmodel[event.listId] = {
      listId: event.listId,
      ownerId: event.ownerId,
      articleIds: [],
      lastUpdated: event.date,
      name: event.name,
      description: event.description,
    };
  } else if (isArticleAddedToListEvent(event)) {
    readmodel[event.listId].articleIds.push(event.articleId.value);
    readmodel[event.listId].lastUpdated = event.date;
  } else if (isArticleRemovedFromListEvent(event)) {
    readmodel[event.listId].articleIds = readmodel[event.listId].articleIds.filter(
      (id) => id !== event.articleId.value,
    );
    readmodel[event.listId].lastUpdated = event.date;
  }

  return readmodel;
};
