import createGetHardCodedEndorsingEditorialCommunities from './hard-coded-endorsing-editorial-communities';
import createRenderSearchResult, { GetCommentCount, GetReviewCount } from './render-search-result';
import createRenderSearchResults from './render-search-results';
import createSearchEuropePmc from './search-europe-pmc';
import { Json } from '../types/json';

export type GetJson = (uri: string) => Promise<Json>;

type RenderPage = (query: string) => Promise<string>;

export { GetCommentCount, GetReviewCount } from './render-search-result';

export default (
  getJson: GetJson,
  getCommentCount: GetCommentCount,
  getReviewCount: GetReviewCount,
  getEditorialCommunity: (id: string) => Promise<{ name: string }>,
): RenderPage => (
  async (query) => {
    const getEndorsingEditorialCommunities = createGetHardCodedEndorsingEditorialCommunities(
      async (id) => (await getEditorialCommunity(id)).name,
    );
    const renderSearchResult = createRenderSearchResult(
      getCommentCount,
      getReviewCount,
      getEndorsingEditorialCommunities,
    );
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
