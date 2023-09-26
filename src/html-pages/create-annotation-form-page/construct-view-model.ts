import { ViewModel } from './view-model';

export const constructViewModel = (articleId: string, listId: string): ViewModel => ({
  articleId,
  listId,
});
