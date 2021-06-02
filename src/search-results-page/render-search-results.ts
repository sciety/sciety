import { htmlEscape } from 'escape-goat';
import * as O from 'fp-ts/Option';
import * as RA from 'fp-ts/ReadonlyArray';
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray';
import { constant, pipe } from 'fp-ts/function';
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
  nextCursor: O.Option<string>,
};

const renderNextLink = (category: string, query: string) => (nextCursor: string): HtmlFragment => toHtmlFragment(`
  <a href="/search?query=${htmlEscape(query)}&category=${category}&cursor=${htmlEscape(nextCursor)}" class="search-results__next_link">Next</a>
`);

const renderListIfNecessary = (nextLink: HtmlFragment) => (
  articles: ReadonlyArray<HtmlFragment>,
) => pipe(
  articles,
  RNEA.fromReadonlyArray,
  O.fold(
    constant(''),
    (a) => `
      <h3 class="visually-hidden">Page 1 of search results</h3>
      <ul class="search-results-list" role="list">
        ${templateListItems(a, 'search-results-list__item')}
      </ul>
      ${nextLink}    
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
  searchResults.itemsToDisplay,
  RA.map(renderSearchResult),
  renderListIfNecessary(pipe(
    searchResults.nextCursor,
    O.map(renderNextLink(searchResults.category, searchResults.query)),
    O.getOrElse(constant('')),
    toHtmlFragment,
  )),
  (searchResultsList) => `
    ${categoryMenu(searchResults)}
    ${searchResultsList}
  `,
  toHtmlFragment,
);
