import { ExpressionDoi } from '../../../types/expression-doi';
import { HtmlFragment } from '../../../types/html-fragment';
import { ListId } from '../../../types/list-id';

export type ViewModel = {
  article: {
    name: HtmlFragment,
    id: ExpressionDoi,
  },
  userLists: ReadonlyArray<{
    id: ListId,
    name: string,
  }>,
  pageHeading: HtmlFragment,
};
