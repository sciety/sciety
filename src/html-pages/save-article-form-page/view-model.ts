import { ArticleId } from '../../types/article-id';
import { HtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';

export type ViewModel = {
  articleId: ArticleId,
  articleTitle: HtmlFragment,
  userLists: ReadonlyArray<{
    id: ListId,
    name: string,
  }>,
};
