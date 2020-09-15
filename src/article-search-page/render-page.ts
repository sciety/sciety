import { RenderSearchResults } from './render-search-results';

type RenderPage = (query: string) => Promise<string>;

export default (
  renderSearchResults: RenderSearchResults,
): RenderPage => async (query) => (
  `
    <header class="ui basic padded vertical segment">
      <h1>Search results</h1>
    </header>

    <section class="ui basic vertical segment">
      ${await renderSearchResults(query)}
    </section>
  `
);
