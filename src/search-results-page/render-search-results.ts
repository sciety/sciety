import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { pageTabs, PageTabsViewModel } from './page-tabs';
import { pagination, PaginationViewModel } from './pagination';
import { renderSearchResultsList } from './render-search-results-list';
import { ArticleViewModel, renderArticleCard } from '../shared-components/article-card';
import { GroupViewModel, renderGroupCard } from '../shared-components/group-card/render-group-card';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type ItemViewModel = ArticleViewModel | GroupViewModel;

const isArticleViewModel = (viewModel: ItemViewModel): viewModel is ArticleViewModel => 'doi' in viewModel;

export type SearchResults = PaginationViewModel & PageTabsViewModel & {
  itemsToDisplay: ReadonlyArray<ItemViewModel>,
};

const renderSearchResult = (viewModel: ItemViewModel) => (
  isArticleViewModel(viewModel) ? renderArticleCard(O.none)(viewModel) : renderGroupCard(viewModel)
);

type RenderSearchResults = (rs: SearchResults) => HtmlFragment;

export const renderSearchResults: RenderSearchResults = (searchResults) => pipe(
  {
    cardsToDisplay: pipe(
      searchResults.itemsToDisplay,
      RA.map(renderSearchResult),
    ),
  },
  renderSearchResultsList,
  pagination(searchResults),
  pageTabs(searchResults),
  toHtmlFragment,
);
