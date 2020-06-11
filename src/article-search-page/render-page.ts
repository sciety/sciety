import createFetchDisqusPostCount from './fetch-disqus-post-count';
import createRenderSearchResult, {
  GetEndorsingEditorialCommunities,
  GetReviewCount,
} from './render-search-result';
import createRenderSearchResults from './render-search-results';
import createSearchEuropePmc from './search-europe-pmc';
import Doi from '../data/doi';

export type GetJson = (uri: string) => Promise<object>;

const createGetHardCodedEndorsingEditorialCommunities = (): GetEndorsingEditorialCommunities => (
  async (doi) => (
    doi.value === '10.1101/209320' ? ['PeerJ'] : []
  )
);

export default (
  getJson: GetJson,
  fetchReviewReferences: (articleVersionDoi: Doi) => Array<unknown>,
) => async (query: string): Promise<string> => {
  const getCommentCount = createFetchDisqusPostCount(getJson);
  const getReviewCount: GetReviewCount = async (doi) => fetchReviewReferences(doi).length;
  const getEndorsingEditorialCommunities = createGetHardCodedEndorsingEditorialCommunities();
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
};
