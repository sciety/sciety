import createRenderSearchResults from './render-search-results';
import Doi from '../data/doi';

export type GetJson = (uri: string) => Promise<object>;

export default (
  getJson: GetJson,
  fetchReviewReferences: (articleVersionDoi: Doi) => Array<unknown>,
) => async (query: string): Promise<string> => {
  const renderSearchResults = createRenderSearchResults(getJson, fetchReviewReferences);
  return `
    <h1 class="header">Search results</h1>
    ${await renderSearchResults(query)}
  `;
};
