import createRenderSearchResult from './render-search-result';
import createRenderSearchResults from './render-search-results';
import createSearchEuropePmc from './search-europe-pmc';
import Doi from '../data/doi';

export type GetJson = (uri: string) => Promise<object>;

export default (
  getJson: GetJson,
  fetchReviewReferences: (articleVersionDoi: Doi) => Array<unknown>,
) => async (query: string): Promise<string> => {
  const getReviewCount = (articleVersionDoi: Doi): number => fetchReviewReferences(articleVersionDoi).length;
  const findArticles = createSearchEuropePmc(getJson);
  const renderSearchResult = createRenderSearchResult(getJson, getReviewCount);
  const renderSearchResults = createRenderSearchResults(findArticles, renderSearchResult);
  return `
    <header class="ui basic padded vertical segment">
      <h1 class="ui header">Search results</h1>
    </header>

    <section class="ui basic vertical segment">
      ${await renderSearchResults(query)}
    </section>
  `;
};
