import * as TE from 'fp-ts/TaskEither';
import { renderSearchResults, SearchResults } from './render-search-results';
import { renderSearchForm } from '../shared-components/render-search-form';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

export type RenderPage = (query: string) => TE.TaskEither<RenderPageError, Page>;

export const renderErrorPage = (error: 'unavailable'): RenderPageError => ({
  type: error,
  message: toHtmlFragment('We\'re having trouble accessing search right now, please try again later.'),
});

export const renderPage = (searchResults: SearchResults): Page => ({
  title: `Search results for ${searchResults.query}`,
  content: toHtmlFragment(`
    <div class="page-content__background">
      <div class="sciety-grid sciety-grid--search-results">
        <header class="page-header page-header--search-results">
          <h1 class="page-heading--search">Search Sciety</h1>
        </header>
        ${renderSearchForm(searchResults.query)}
        <section class="search-results">
          ${renderSearchResults(searchResults)}
        </section>
      </div>
    </div>
  `),
});
