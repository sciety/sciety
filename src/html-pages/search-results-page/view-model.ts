import { PaginationViewModel } from './render-as-html/wrap-with-pagination-information';
import { ArticleCardViewModel } from '../../shared-components/article-card';
import { GroupCardViewModel } from '../../shared-components/group-card';

export type ItemViewModel = ArticleCardViewModel | GroupCardViewModel;

export const isArticleViewModel = (viewModel: ItemViewModel): viewModel is ArticleCardViewModel => 'articleId' in viewModel;

export type ViewModel = PaginationViewModel & {
  query: string,
  evaluatedOnly: boolean,
  availableArticleMatches: number,
  availableGroupMatches: number,
  category: string,
  itemsToDisplay: ReadonlyArray<ItemViewModel>,
};
