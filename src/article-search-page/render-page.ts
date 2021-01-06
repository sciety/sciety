import * as T from 'fp-ts/lib/Task';
import { Result } from 'true-myth';
import { RenderSearchResults } from './render-search-results';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';
import { RenderPageError } from '../types/render-page-error';

export type RenderPage = (query: string) => T.Task<Result<{
  title: string,
  content: HtmlFragment,
}, RenderPageError>>;

export default (
  renderSearchResults: RenderSearchResults,
): RenderPage => (query) => async () => {
  try {
    const searchResults = await renderSearchResults(query)();
    return Result.ok({
      title: 'Search results',
      content: toHtmlFragment(`
      <div class="sciety-grid sciety-grid--simple">

        <header class="page-header">
          <h1>Search results</h1>
        </header>

        <section class="ui basic vertical segment">
          ${searchResults}
        </section>

      </div>
    `),
    });
  } catch (error: unknown) {
    return Result.err({
      type: 'unavailable',
      message: toHtmlFragment(`
        We’re having trouble searching for you, please come back later.
      `),
    });
  }
};
