import { DomainEvent } from '../../domain-events';
import { isArticleAddedToListEvent } from '../../domain-events/article-added-to-list-event';
/* eslint-disable no-param-reassign */
import { isListCreatedEvent } from '../../domain-events/list-created-event';
import { ListId } from '../../types/list-id';
import { ListOwnerId } from '../../types/list-owner-id';

type ListState = {
  ownerId: ListOwnerId,
  articleIds: Array<string>,
};
export type ReadModel = Record<ListId, ListState>;

export const initialState = (): ReadModel => ({});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleEvent = (readmodel: ReadModel, event: DomainEvent): ReadModel => {
  if (isListCreatedEvent(event)) {
    readmodel[event.listId] = {
      ownerId: event.ownerId,
      articleIds: [],
    };
  } else if (isArticleAddedToListEvent(event)) {
    readmodel[event.listId].articleIds.push(event.articleId.value);
  }

  return readmodel;
};
