import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';
import { ListId } from '../../types/list-id';

export type ViewModel = {
  articleId: Doi,
  articleTitle: HtmlFragment,
  userLists: ReadonlyArray<{
    id: ListId,
    name: string,
  }>,
};
