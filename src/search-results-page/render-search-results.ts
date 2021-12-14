import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { nextLink, SearchParameters } from './next-link';
import { pageTabs, PageTabsViewModel } from './page-tabs';
import { renderSearchResultsList } from './render-search-results-list';
import { ArticleViewModel, renderArticleCard } from '../shared-components/article-card';
import { GroupViewModel, renderGroupCard } from '../shared-components/group-card/render-group-card';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type ItemViewModel = ArticleViewModel | GroupViewModel;

const isArticleViewModel = (viewModel: ItemViewModel): viewModel is ArticleViewModel => 'doi' in viewModel;

export type SearchResults = SearchParameters & PageTabsViewModel & {
  itemsToDisplay: ReadonlyArray<ItemViewModel>,
  pageNumber: number,
  numberOfPages: number,
};

const renderSearchResult = (viewModel: ItemViewModel) => (
  isArticleViewModel(viewModel) ? renderArticleCard(O.none)(viewModel) : renderGroupCard(viewModel)
);

const pagination = (searchResults: SearchResults) => (content: HtmlFragment) => toHtmlFragment(`
  ${content}
  ${nextLink({ ...searchResults, pageNumber: searchResults.pageNumber + 1 })}
`);

type RenderSearchResults = (rs: SearchResults) => HtmlFragment;

export const renderSearchResults: RenderSearchResults = (searchResults) => pipe(
  {
    cardsToDisplay: pipe(
      searchResults.itemsToDisplay,
      RA.map(renderSearchResult),
    ),
    pageNumber: searchResults.pageNumber,
    numberOfPages: searchResults.numberOfPages,
    category: searchResults.category,
  },
  renderSearchResultsList,
  pagination(searchResults),
  pageTabs(searchResults),
  toHtmlFragment,
);
