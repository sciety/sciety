import { Doi } from '../../types/doi';
import { ListId } from '../../types/list-id';

export type ViewModel = {
  articleId: Doi,
  listId: ListId,
  listName: string,
};
