import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, pipe } from 'fp-ts/function';
import { nextLink, SearchParameters } from './next-link';
import { GroupViewModel, renderGroupCard } from './render-group-card';
import { ArticleViewModel, renderArticleCard } from '../shared-components/article-card';
import { templateListItems } from '../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type ItemViewModel = ArticleViewModel | GroupViewModel;

const isArticleViewModel = (viewModel: ItemViewModel): viewModel is ArticleViewModel => 'doi' in viewModel;
// export type SearchResults = {
//   query: string,
//   category: string,
//   itemsToDisplay: ReadonlyArray<ItemViewModel>,
//   availableArticleMatches: number,
//   availableGroupMatches: number,
//   pageNumber: number,
//   nextCursor: O.Option<string>,
//   numberOfPages: number,
// };
export type SearchResults = SearchParameters & Tabs & {
  itemsToDisplay: ReadonlyArray<ItemViewModel>,
  pageNumber: number,
  numberOfPages: number,
};

type PageOfResults = {
  cardsToDisplay: ReadonlyArray<HtmlFragment>,
  pageNumber: number,
  numberOfPages: number,
  category: string,
};

const renderListIfNecessary = (page: PageOfResults) => pipe(
  page.cardsToDisplay,
  RNEA.fromReadonlyArray,
  O.fold(
    constant(''),
    (a) => `
      ${page.category === 'articles' ? `<h3 class="search-results__page_count">Showing page ${page.pageNumber} of ${page.numberOfPages}</h3>` : ''}
      <ul class="search-results-list" role="list">
        ${templateListItems(a, 'search-results-list__item')}
      </ul>
    `,
  ),
);

const renderSearchResult = (viewModel: ItemViewModel) => (
  isArticleViewModel(viewModel) ? renderArticleCard(viewModel) : renderGroupCard(viewModel)
);

type Tabs = {
  query: string,
  availableArticleMatches: number,
  availableGroupMatches: number,
  category: string,
};

const tabsWithGroupsActive = (tabs: Tabs) => `
  <a href="/search?query=${htmlEscape(tabs.query)}&category=articles" class="search-results-tab search-results-tab--link" aria-label="Discover matching articles (${tabs.availableArticleMatches} search results)">Articles (${tabs.availableArticleMatches})</a>
  <h3 class="search-results-tab search-results-tab--heading"><span class="visually-hidden">Currently showing </span>Groups (${tabs.availableGroupMatches}<span class="visually-hidden"> search results</span>)</h3>
`;

const tabsWithArticlesActive = (tabs: Tabs) => `
  <h3 class="search-results-tab search-results-tab--heading"><span class="visually-hidden">Currently showing </span>Articles (${tabs.availableArticleMatches}<span class="visually-hidden"> search results</span>)</h3>
  <a href="/search?query=${htmlEscape(tabs.query)}&category=groups" class="search-results-tab search-results-tab--link" aria-label="Discover matching groups (${tabs.availableGroupMatches} search results)">Groups (${tabs.availableGroupMatches}<span class="visually-hidden"> search results</span>)</a>
`;

const categoryTabs = (tabs: Tabs) => `
  <h2 class="visually-hidden">Search result categories</h2>
  <div class="search-results-tabs-container">
    ${tabs.category === 'groups' ? tabsWithGroupsActive(tabs) : tabsWithArticlesActive(tabs)}
  </div>
`;

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
  renderListIfNecessary,
  (searchResultsList) => `
    ${categoryTabs(searchResults)}
    ${searchResultsList}
    ${nextLink({ ...searchResults, pageNumber: searchResults.pageNumber + 1 })}
  `,
  toHtmlFragment,
);
