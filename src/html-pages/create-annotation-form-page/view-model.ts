import { Doi } from '../../types/doi';
import { ListId } from '../../types/list-id';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

export type ViewModel = {
  articleId: Doi,
  listId: ListId,
  articleTitle: SanitisedHtmlFragment,
  listName: string,
};
