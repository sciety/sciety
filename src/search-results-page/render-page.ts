import { renderSearchResults, SearchResults } from './render-search-results';
import { renderSearchForm } from '../shared-components/render-search-form';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export const renderErrorPage = toHtmlFragment(
  'We\'re having trouble accessing search right now, please try again later.',
);

type SearchParams = {
  query: string,
  evaluatedOnly: boolean,
};

export const renderSearchResultsTitle = (query: string): string => `Search results for ${query}`;

export const renderSearchResultsHeader = (searchParams: SearchParams): HtmlFragment => toHtmlFragment(`
  <header class="page-header page-header--search-results">
    <h1>Search Sciety</h1>
  </header>
  ${renderSearchForm(searchParams.query, searchParams.evaluatedOnly)}
  <section class="search-results">`); // do not add whitespace here as it prevents the :empty selector from working

export const renderPage = (searchResults: SearchResults): HtmlFragment => toHtmlFragment(`
      ${renderSearchResults(searchResults)}
    </section>
  `);
