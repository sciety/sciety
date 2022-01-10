import { Doi } from '../types/doi';
import { ListId } from '../types/list-id';

export type ArticleAddedToListEvent = Readonly<{
  type: 'ArticleAddedToList',
  date: Date,
  articleId: Doi,
  listId: ListId,
}>;

// ts-unused-exports:disable-next-line
export const articleAddedToList = (
  articleId: Doi,
  listId: ListId,
  date = new Date(),
): ArticleAddedToListEvent => ({
  type: 'ArticleAddedToList',
  date,
  articleId,
  listId,
});
