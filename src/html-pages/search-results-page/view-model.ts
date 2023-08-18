import { PaginationViewModel } from './render-as-html/wrap-with-pagination-information';
import { ArticleCardViewModel } from '../../shared-components/article-card';
import { GroupCardViewModel } from '../../shared-components/group-card';
import { PaginationControlsViewModel } from '../../shared-components/pagination';

export type ItemViewModel = ArticleCardViewModel | GroupCardViewModel;

export const isArticleViewModel = (viewModel: ItemViewModel): viewModel is ArticleCardViewModel => 'articleId' in viewModel;

export type ViewModel = PaginationViewModel & PaginationControlsViewModel & {
  query: string,
  evaluatedOnly: boolean,
  availableArticleMatches: number,
  availableGroupMatches: number,
  category: string,
  itemsToDisplay: ReadonlyArray<ItemViewModel>,
};
