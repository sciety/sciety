import createGetHardCodedEndorsingEditorialCommunities, { GetNameForEditorialCommunity } from './hard-coded-endorsing-editorial-communities';
import createRenderSearchResult, { GetReviewCount } from './render-search-result';
import createRenderSearchResults from './render-search-results';
import createSearchEuropePmc from './search-europe-pmc';
import Doi from '../data/doi';
import createGetBiorxivCommentCount, { GetCommentCountForUri } from '../infrastructure/get-biorxiv-comment-count';

export type GetJson = (uri: string) => Promise<object>;

type RenderPage = (query: string) => Promise<string>;

export default (
  getJson: GetJson,
  getCommentCountForUri: GetCommentCountForUri,
  fetchReviewReferences: (articleVersionDoi: Doi) => Array<unknown>,
  getEditorialCommunity: (id: string) => { name: string },
): RenderPage => (
  async (query) => {
    const getCommentCount = createGetBiorxivCommentCount(getCommentCountForUri);
    const getReviewCount: GetReviewCount = async (doi) => fetchReviewReferences(doi).length;
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
