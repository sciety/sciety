import { htmlEscape } from 'escape-goat';
import * as TE from 'fp-ts/TaskEither';
import { renderSearchResults, SearchResults } from './render-search-results';
import { toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

export type RenderPage = (query: string) => TE.TaskEither<RenderPageError, Page>;

export const renderErrorPage = (error: 'unavailable'): RenderPageError => ({
  type: error,
  message: toHtmlFragment('We\'re having trouble searching for you, please come back later.'),
});

export const renderPage = (searchResults: SearchResults): Page => ({
  title: `Search results for ${searchResults.query}`,
  content: toHtmlFragment(`
    <div class="page-content__background">
      <div class="sciety-grid sciety-grid--search-results">
        <header class="page-header page-header--search-results">
          <h1 class="page-heading--search">Search Sciety</h1>
        </header>
        <form action="/search" method="get" class="search-form">
          <label for="searchText" class="visually-hidden">Search term</label>
          ${htmlEscape`<input value="${searchResults.query}" id="searchText" name="query" placeholder="Find articles and evaluating groups…" class="search-form__text">`}
          <button type="reset" id="clearSearchText" class="search-form__clear visually-hidden">
            <img src="/static/images/clear-search-text-icon.svg" class="search-form__clear_icon" alt="">
          </button>
          <button type="submit" class="visually-hidden">Search</button>
        </form>
        <section class="search-results">
          ${renderSearchResults(searchResults)}
        </section>
      </div>
    </div>
  `),
});
