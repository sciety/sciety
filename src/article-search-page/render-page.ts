import { Result } from 'true-myth';
import { RenderSearchResults } from './render-search-results';
import { HtmlFragment, toHtmlFragment } from '../types/html-fragment';

export type RenderPage = (query: string) => Promise<Result<{content: HtmlFragment}, never>>;

export default (
  renderSearchResults: RenderSearchResults,
): RenderPage => async (query) => Result.ok({
  content: toHtmlFragment(`
    <div class="sciety-grid sciety-grid--simple">

      <header class="page-header">
        <h1>Search results</h1>
      </header>

      <section class="ui basic vertical segment">
        ${await renderSearchResults(query)}
      </section>

    </div>
  `),
});
