import * as O from 'fp-ts/Option';
import { ArticleCardViewModel } from '../shared-components/article-card';
import { PaginationControlsViewModel } from '../shared-components/pagination';

export type ViewModel = {
  pageHeading: string,
  categoryContent: ReadonlyArray<ArticleCardViewModel>,
  paginationControls: O.Option<PaginationControlsViewModel>,
};
