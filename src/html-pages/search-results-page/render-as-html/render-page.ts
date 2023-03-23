import { pipe } from 'fp-ts/function';
import { renderSearchResults } from '../render-search-results';
import { renderSearchForm } from '../../../shared-components/search-form';
import { HtmlFragment, toHtmlFragment } from '../../../types/html-fragment';
import { ViewModel } from '../view-model';

export const renderPage = (searchResults: ViewModel): HtmlFragment => pipe(
  `
    <header class="page-header page-header--search-results">
      <h1>Search Sciety</h1>
    </header>
    ${renderSearchForm(searchResults.query, searchResults.evaluatedOnly)}
    <section class="search-results">
      ${renderSearchResults(searchResults)}
    </section>
  `,
  toHtmlFragment,
);
