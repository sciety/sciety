import * as E from 'fp-ts/Either';
import { ArticleCardViewModel, ArticleErrorCardViewModel } from '../shared-components/article-card';
import { PaginationControlsViewModel } from '../shared-components/pagination';

type InformationalMessage = string;

type ArticleCardSlot = E.Either<ArticleErrorCardViewModel, ArticleCardViewModel>;

export type PaginatedCards = {
  categoryContent: ReadonlyArray<ArticleCardSlot>,
  paginationControls: PaginationControlsViewModel,
};

export type ViewModel = {
  pageHeading: string,
  content: E.Either<InformationalMessage, PaginatedCards>,
  categoryContent: ReadonlyArray<ArticleCardViewModel>,
  paginationControls: PaginationControlsViewModel,
};
