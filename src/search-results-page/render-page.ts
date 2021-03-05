import * as TE from 'fp-ts/TaskEither';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { Page } from '../types/page';
import { RenderPageError } from '../types/render-page-error';

export type RenderPage = (query: string) => TE.TaskEither<RenderPageError, Page>;

export const renderErrorPage = (error: 'unavailable'): RenderPageError => ({
  type: error,
  message: toHtmlFragment('We\'re having trouble searching for you, please come back later.'),
});

export const renderPage = (searchResults: HtmlFragment): Page => ({
  title: 'Search results',
  content: toHtmlFragment(`
    <div class="search-results-page__background--filler">
      <div class="sciety-grid sciety-grid--search-results">
        <header class="page-header page-header--search-results">
          <h1>Search results</h1>
        </header>
        <section class="search-results">
          ${searchResults}
        </section>
      </div>
    </div>
  `),
});
