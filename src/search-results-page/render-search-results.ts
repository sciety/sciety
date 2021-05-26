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
  itemsToDisplay: ReadonlyArray<ItemViewModel>,
  availableMatches: number,
  availableArticleMatches: number,
  availableGroupMatches: number,
};

const renderListIfNecessary = (articles: ReadonlyArray<HtmlFragment>) => pipe(
  articles,
  RNEA.fromReadonlyArray,
  O.fold(
    constant(''),
    (a) => `
      <ul class="search-results-list" role="list">
        ${templateListItems(a, 'search-results-list__item')}
      </ul>
    `,
  ),
);

const renderSearchResult = (viewModel: ItemViewModel) => (
  isArticleViewModel(viewModel) ? renderArticleCard(viewModel) : renderGroupCard(viewModel)
);

const categoryMenu = (searchResults: SearchResults) => `
  <h3 class="visually-hidden">Search result categories</h3>
  <ul class="search-results__categories" aria-role="list">
    <li>
      <a href="/search?query=${htmlEscape(searchResults.query)}&category=articles">All articles (${searchResults.availableArticleMatches})</a>
    <li>
      <a href="/search?query=${htmlEscape(searchResults.query)}&category=groups">Groups (${searchResults.availableGroupMatches})</a>
    </li>
  </ul>
`;

const summary = (searchResults: SearchResults) => `
  <p class="search-results__summary">
    Showing ${searchResults.itemsToDisplay.length} of ${searchResults.availableMatches} results for
    <span class="search-results__query">${htmlEscape(searchResults.query)}</span>
  </p>
`;

type RenderSearchResults = (rs: SearchResults) => HtmlFragment;

export const renderSearchResults: RenderSearchResults = (searchResults) => pipe(
  searchResults.itemsToDisplay,
  RA.map(renderSearchResult),
  renderListIfNecessary,
  (searchResultsList) => `
    ${process.env.EXPERIMENT_ENABLED === 'true' ? categoryMenu(searchResults) : summary(searchResults)}
    ${searchResultsList}
  `,
  toHtmlFragment,
);
