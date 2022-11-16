/* eslint-disable no-param-reassign */
import { DomainEvent, isArticleAddedToListEvent, isArticleRemovedFromListEvent } from '../../domain-events';
import { isListCreatedEvent } from '../../domain-events/list-created-event';
import { ListId } from '../../types/list-id';
import { ListOwnerId } from '../../types/list-owner-id';

type ListState = {
  listId: ListId,
  ownerId: ListOwnerId,
  articleIds: Array<string>,
};
export type ReadModel = Record<ListId, ListState>;

export const initialState = (): ReadModel => ({});

export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isListCreatedEvent(event)) {
    readmodel[event.listId] = {
      listId: event.listId,
      ownerId: event.ownerId,
      articleIds: [],
    };
  } else if (isArticleAddedToListEvent(event)) {
    readmodel[event.listId].articleIds.push(event.articleId.value);
  } else if (isArticleRemovedFromListEvent(event)) {
    readmodel[event.listId].articleIds = readmodel[event.listId].articleIds.filter(
      (id) => id !== event.articleId.value,
    );
  }

  return readmodel;
};
