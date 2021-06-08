import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, pipe } from 'fp-ts/function';
import { nextLink } from './next-link';
import { GroupViewModel, renderGroupCard } from './render-group-card';
import { ArticleViewModel, renderArticleCard } from '../shared-components/article-card';
import { templateListItems } from '../shared-components/list-items';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type ItemViewModel = ArticleViewModel | GroupViewModel;

const isArticleViewModel = (viewModel: ItemViewModel): viewModel is ArticleViewModel => 'doi' in viewModel;

export type SearchResults = {
  query: string,
  category: string,
  itemsToDisplay: ReadonlyArray<ItemViewModel>,
  availableArticleMatches: number,
  availableGroupMatches: number,
  pageNumber: number,
  nextCursor: O.Option<string>,
  numberOfPages: number,
};

type PageOfResults = {
  itemsToDisplay: ReadonlyArray<HtmlFragment>,
  pageNumber: number,
  numberOfPages: number,
  category: string,
};

const renderListIfNecessary = (page: PageOfResults) => pipe(
  page.itemsToDisplay,
  RNEA.fromReadonlyArray,
  O.fold(
    constant(''),
    (a) => `
      ${page.category === 'articles' ? `<h3 class="search-results__page_count">Page ${page.pageNumber} of ${page.numberOfPages}</h3>` : ''}
      <ul class="search-results-list" role="list">
        ${templateListItems(a, 'search-results-list__item')}
      </ul>
    `,
  ),
);

const renderSearchResult = (viewModel: ItemViewModel) => (
  isArticleViewModel(viewModel) ? renderArticleCard(viewModel) : renderGroupCard(viewModel)
);

const menuWithGroupsActive = (searchResults: SearchResults) => `
  <a href="/search?query=${htmlEscape(searchResults.query)}&category=articles" class="search-results-tab search-results-tab--link" aria-label="Discover matching articles (${searchResults.availableArticleMatches} search results)">Articles (${searchResults.availableArticleMatches})</a>
  <h3 class="search-results-tab search-results-tab--heading"><span class="visually-hidden">Currently showing </span>Groups (${searchResults.availableGroupMatches}<span class="visually-hidden"> search results</span>)</h3>
`;

const menuWithArticlesActive = (searchResults: SearchResults) => `
  <h3 class="search-results-tab search-results-tab--heading"><span class="visually-hidden">Currently showing </span>Articles (${searchResults.availableArticleMatches}<span class="visually-hidden"> search results</span>)</h3>
  <a href="/search?query=${htmlEscape(searchResults.query)}&category=groups" class="search-results-tab search-results-tab--link" aria-label="Discover matching groups (${searchResults.availableGroupMatches} search results)">Groups (${searchResults.availableGroupMatches}<span class="visually-hidden"> search results</span>)</a>
`;

const categoryMenu = (searchResults: SearchResults) => `
  <h2 class="visually-hidden">Search result categories</h2>
  <div class="search-results-tabs-container">
    ${searchResults.category === 'groups' ? menuWithGroupsActive(searchResults) : menuWithArticlesActive(searchResults)}
  </div>
`;

type RenderSearchResults = (rs: SearchResults) => HtmlFragment;

export const renderSearchResults: RenderSearchResults = (searchResults) => pipe(
  {
    itemsToDisplay: pipe(
      searchResults.itemsToDisplay,
      RA.map(renderSearchResult),
    ),
    pageNumber: searchResults.pageNumber,
    numberOfPages: searchResults.numberOfPages,
    category: searchResults.category,
  },
  renderListIfNecessary,
  (searchResultsList) => `
    ${categoryMenu(searchResults)}
    ${searchResultsList}
    ${nextLink({ ...searchResults, nextPageNumber: searchResults.pageNumber + 1 })}
  `,
  toHtmlFragment,
);
