import * as O from 'fp-ts/Option';
import { ArticleCardViewModel } from '../shared-components/article-card';
import { PaginationControlsViewModel } from '../shared-components/pagination';

type Content = {
  categoryContent: ReadonlyArray<ArticleCardViewModel>,
  paginationControls: O.Option<PaginationControlsViewModel>,
};

export type ViewModel = {
  pageHeading: string,
  content: Content,
  categoryContent: ReadonlyArray<ArticleCardViewModel>,
  paginationControls: O.Option<PaginationControlsViewModel>,
};
