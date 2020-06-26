import createGetHardCodedEndorsingEditorialCommunities, { GetNameForEditorialCommunity } from './hard-coded-endorsing-editorial-communities';
import createRenderSearchResult, { GetReviewCount } from './render-search-result';
import createRenderSearchResults from './render-search-results';
import createSearchEuropePmc from './search-europe-pmc';
import Doi from '../types/doi';
import { Json } from '../types/json';

export type GetJson = (uri: string) => Promise<Json>;

type RenderPage = (query: string) => Promise<string>;

export { GetReviewCount } from './render-search-result';

export default (
  getJson: GetJson,
  getCommentCount: (doi: Doi) => Promise<number>,
  getReviewCount: GetReviewCount,
  getEditorialCommunity: (id: string) => { name: string },
): RenderPage => (
  async (query) => {
    const getNameForEditorialCommunity: GetNameForEditorialCommunity = (id) => getEditorialCommunity(id).name;
    const getEndorsingEditorialCommunities = createGetHardCodedEndorsingEditorialCommunities(
      getNameForEditorialCommunity,
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
