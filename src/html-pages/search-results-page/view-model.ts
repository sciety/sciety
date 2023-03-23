import { PaginationViewModel } from './render-as-html/pagination';
import { ArticleViewModel } from '../../shared-components/article-card';
import { GroupViewModel } from '../../shared-components/group-card';

export type ItemViewModel = ArticleViewModel | GroupViewModel;

export const isArticleViewModel = (viewModel: ItemViewModel): viewModel is ArticleViewModel => 'articleId' in viewModel;

export type ViewModel = PaginationViewModel & {
  query: string,
  evaluatedOnly: boolean,
  availableArticleMatches: number,
  availableGroupMatches: number,
  category: string,
  itemsToDisplay: ReadonlyArray<ItemViewModel>,
};
