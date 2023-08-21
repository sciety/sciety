import { PaginationViewModel } from './render-as-html/wrap-with-pagination-information';
import { ArticleCardViewModel } from '../../shared-components/article-card';
import { GroupCardViewModel } from '../../shared-components/group-card';
import { PaginationControlsViewModel } from '../../shared-components/pagination';

export type ItemViewModel = ArticleCardViewModel | GroupCardViewModel;

export const isArticleViewModel = (viewModel: ItemViewModel): viewModel is ArticleCardViewModel => 'articleId' in viewModel;

type NoGroupsEvaluatedTheFoundArticles = {
  tag: 'no-groups-evaluated-the-found-articles',
};

type SomeRelatedGroups = {
  tag: 'some-related-groups',
  groups: ReadonlyArray<{
    path: string,
    name: string,
  }>,
};

export type ViewModel = PaginationViewModel & PaginationControlsViewModel & {
  query: string,
  evaluatedOnly: boolean,
  availableArticleMatches: number,
  availableGroupMatches: number,
  category: string,
  itemsToDisplay: ReadonlyArray<ItemViewModel>,
  relatedGroups: NoGroupsEvaluatedTheFoundArticles | SomeRelatedGroups,
};
