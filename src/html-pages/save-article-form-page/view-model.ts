import { Doi } from '../../types/doi';
import { HtmlFragment } from '../../types/html-fragment';

export type ViewModel = {
  articleId: Doi,
  articleTitle: HtmlFragment,
  userListNames: ReadonlyArray<HtmlFragment>,
};
