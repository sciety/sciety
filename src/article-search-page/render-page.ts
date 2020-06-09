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
    <h1 class="header">Search results</h1>
    ${await renderSearchResults(query)}
  `;
};
