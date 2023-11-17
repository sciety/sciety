import { ArticleId } from '../../types/article-id.js';
import { HtmlFragment } from '../../types/html-fragment.js';
import { ListId } from '../../types/list-id.js';

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
