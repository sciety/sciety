import { Doi } from '../types/doi';
import { EventId, generate } from '../types/event-id';
import { ListId } from '../types/list-id';

export type ArticleAddedToListEvent = Readonly<{
  id: EventId,
  type: 'ArticleAddedToList',
  date: Date,
  articleId: Doi,
  listId: ListId,
}>;

export const articleAddedToList = (
  articleId: Doi,
  listId: ListId,
  date = new Date(),
): ArticleAddedToListEvent => ({
  id: generate(),
  type: 'ArticleAddedToList',
  date,
  articleId,
  listId,
});
