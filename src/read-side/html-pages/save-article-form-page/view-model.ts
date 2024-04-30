import { ArticleId } from '../../../types/article-id';
import { HtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';

export type ViewModel = {
  article: {
    name: HtmlFragment,
    id: ArticleId,
  },
  userLists: ReadonlyArray<{
    id: ListId,
    name: string,
  }>,
  pageHeading: HtmlFragment,
};
