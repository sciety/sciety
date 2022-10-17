import { DomainEvent } from '../domain-events';
import { ListId } from '../types/list-id';

export type CollapsedArticlesAddedToList = {
  type: 'CollapsedArticlesAddedToList',
  listId: ListId,
  date: Date,
  articleCount: number,
};

export type StateEntry = DomainEvent | CollapsedArticlesAddedToList;
