import * as TE from 'fp-ts/TaskEither';
import { flow } from 'fp-ts/function';
import { RenderSearchResults } from './render-search-results';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';

type Page = {
  title: string,
  content: HtmlFragment,
};
export type RenderPage = (query: string) => TE.TaskEither<RenderPageError, Page>;

const renderErrorPage = (error: 'unavailable'): RenderPageError => ({
  type: error,
  message: toHtmlFragment('We\'re having trouble searching for you, please come back later.'),
});

const renderPage = (searchResults: HtmlFragment): Page => ({
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

export const createRenderPage = (renderSearchResults: RenderSearchResults): RenderPage => flow(
  renderSearchResults,
  TE.bimap(renderErrorPage, renderPage),
);
