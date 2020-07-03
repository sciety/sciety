import { RenderSearchResult } from './render-search-result';
import createRenderSearchResults from './render-search-results';
import createSearchEuropePmc from './search-europe-pmc';
import { Json } from '../types/json';

export type GetJson = (uri: string) => Promise<Json>;

type RenderPage = (query: string) => Promise<string>;

export { GetCommentCount, GetReviewCount } from './render-search-result';

export default (
  getJson: GetJson,
  renderSearchResult: RenderSearchResult,
): RenderPage => (
  async (query) => {
    const findArticles = createSearchEuropePmc(getJson);
    const renderSearchResults = createRenderSearchResults(findArticles, renderSearchResult);

    return `
      <header class="ui basic padded vertical segment">
        <h1 class="ui header">Search results</h1>
      </header>

      <section class="ui basic vertical segment">
        ${await renderSearchResults(query)}
      </section>
    `;
  }
);
