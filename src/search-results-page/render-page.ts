import * as TE from 'fp-ts/TaskEither';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';

type Page = {
  title: string,
  content: HtmlFragment,
};
export type RenderPage = (query: string) => TE.TaskEither<RenderPageError, Page>;

export const renderErrorPage = (error: 'unavailable'): RenderPageError => ({
  type: error,
  message: toHtmlFragment('We\'re having trouble searching for you, please come back later.'),
});

export const renderPage = (searchResults: HtmlFragment): Page => ({
  title: 'Search results',
  content: toHtmlFragment(`
    <div class="sciety-grid sciety-grid--simple">
      <header class="page-header">
        <h1>Search results</h1>
      </header>
      <section class="search-results">
        ${searchResults}
      </section>
    </div>
  `),
});
