import * as O from 'fp-ts/Option';
import { PaginationViewModel } from './render-as-html/wrap-with-pagination-information';
import { ArticleCardViewModel } from '../../shared-components/article-card';
import { GroupCardViewModel } from '../../shared-components/group-card';
import { PaginationControlsViewModel } from '../../shared-components/pagination';

export type ItemCardViewModel = ArticleCardViewModel | GroupCardViewModel;

export const isArticleViewModel = (viewModel: ItemCardViewModel): viewModel is ArticleCardViewModel => 'articleId' in viewModel;

type NoGroupsEvaluatedTheFoundArticles = {
  tag: 'no-groups-evaluated-the-found-articles',
};

export type SomeRelatedGroups = {
  tag: 'some-related-groups',
  items: ReadonlyArray<{
    groupPageHref: string,
    groupName: string,
    largeLogoUrl: O.Option<string>,
  }>,
};

export type ArticlesCategoryViewModel = {
  relatedGroups: NoGroupsEvaluatedTheFoundArticles | SomeRelatedGroups,
};

export type ViewModel = ArticlesCategoryViewModel & PaginationViewModel & PaginationControlsViewModel & {
  query: string,
  evaluatedOnly: boolean,
  itemCardsToDisplay: ReadonlyArray<ItemCardViewModel>,
};
