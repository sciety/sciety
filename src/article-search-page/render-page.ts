import { Result } from 'true-myth';
import { RenderSearchResults } from './render-search-results';

export type RenderPage = (query: string) => Promise<Result<{content: string}, never>>;

export default (
  renderSearchResults: RenderSearchResults,
): RenderPage => async (query) => Result.ok({
  content: `
    <header class="page-header">
      <h1>Search results</h1>
    </header>

    <section class="ui basic vertical segment">
      ${await renderSearchResults(query)}
    </section>
  `,
});
