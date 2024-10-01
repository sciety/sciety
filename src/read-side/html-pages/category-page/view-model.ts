import * as E from 'fp-ts/Either';
import { ArticleCardViewModel } from '../shared-components/article-card';
import { PaginationControlsViewModel } from '../shared-components/pagination';

type InformationalMessage = string;

export type PaginatedCards = {
  categoryContent: ReadonlyArray<ArticleCardViewModel>,
  paginationControls: PaginationControlsViewModel,
};

export type ViewModel = {
  pageHeading: string,
  content: E.Either<InformationalMessage, PaginatedCards>,
  categoryContent: ReadonlyArray<ArticleCardViewModel>,
  paginationControls: PaginationControlsViewModel,
};
