import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

export type ViewModel = {
  articleId: string,
  listId: string,
  articleTitle: SanitisedHtmlFragment,
  listName: string,
};
