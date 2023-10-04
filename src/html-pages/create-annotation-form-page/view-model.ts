import { ArticleId } from '../../types/article-id';
import { ListId } from '../../types/list-id';
import { SanitisedHtmlFragment } from '../../types/sanitised-html-fragment';

export type ViewModel = {
  articleId: ArticleId,
  listId: ListId,
  articleTitle: SanitisedHtmlFragment,
  listName: string,
};
