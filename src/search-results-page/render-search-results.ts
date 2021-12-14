import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import { pipe } from 'fp-ts/function';
import { nextLink, SearchParameters } from './next-link';
import { renderSearchResultsList } from './render-search-results-list';
import { ArticleViewModel, renderArticleCard } from '../shared-components/article-card';
import { GroupViewModel, renderGroupCard } from '../shared-components/group-card/render-group-card';
import { tabs } from '../shared-components/tabs';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type ItemViewModel = ArticleViewModel | GroupViewModel;

const isArticleViewModel = (viewModel: ItemViewModel): viewModel is ArticleViewModel => 'doi' in viewModel;

export type SearchResults = SearchParameters & Tabs & {
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

type Tabs = {
  query: string,
  availableArticleMatches: number,
  availableGroupMatches: number,
  category: string,
};

const pageTabs = (searchResults: SearchResults) => tabs({
  tabList: [
    {
      label: toHtmlFragment(`Articles (${searchResults.availableArticleMatches}<span class="visually-hidden"> search results</span>)`),
      url: `/search?query=${htmlEscape(searchResults.query)}&category=articles`,
    },
    {
      label: toHtmlFragment(`Groups (${searchResults.availableGroupMatches}<span class="visually-hidden"> search results</span>)`),
      url: `/search?query=${htmlEscape(searchResults.query)}&category=groups`,
    },
  ],
  activeTabIndex: searchResults.category === 'groups' ? 1 : 0,
});

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
