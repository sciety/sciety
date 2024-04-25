import { DomainEvent, EventOfType } from '../../../../domain-events';
import { ListId } from '../../../../types/list-id';

export type CollapsedArticlesAddedToList = {
  type: 'CollapsedArticlesAddedToList',
  listId: ListId,
  date: Date,
  articleCount: number,
};

export const isCollapsedArticlesAddedToList = (
  entry: FeedItem,
): entry is CollapsedArticlesAddedToList => entry.type === 'CollapsedArticlesAddedToList';

export type FeedItem = DomainEvent | CollapsedArticlesAddedToList;

export const isArticleAddedToListEvent = (event: { type: string }):
  event is EventOfType<'ArticleAddedToList'> => event.type === 'ArticleAddedToList';
