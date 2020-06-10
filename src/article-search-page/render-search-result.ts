import Doi from '../data/doi';
import createLogger from '../logger';

export type GetJson = (uri: string) => Promise<object>;

export interface SearchResult {
  doi: string;
  title: string;
  authorString: string;
}

const log = createLogger('article-search-page:render-search-result');

const resolveToCanonicalUri = (doi: Doi): string => `https://www.biorxiv.org/content/${doi.value}v1`;

type FetchDisqusPostCount = (doi: Doi) => Promise<string>;

interface DisqusData {
  response: Array< {posts: number} >;
}

const createFetchDisqusPostCount = (getJson: GetJson): FetchDisqusPostCount => (
  async (doi) => {
    const uri = resolveToCanonicalUri(doi);
    log(`Resolved URI = ${uri}`);
    try {
      const disqusData = await getJson(`https://disqus.com/api/3.0/threads/list.json?api_key=${process.env.DISQUS_API_KEY}&forum=biorxivstage&thread=link:${uri}`) as DisqusData;
      log(`Disqus response: ${JSON.stringify(disqusData)}`);

      return `${disqusData.response[0].posts}`;
    } catch (e) {
      log(`Disqus API error: ${e.message}`);

      return 'n/a';
    }
  }
);

export type RenderSearchResult = (result: SearchResult) => Promise<string>;

export default (
  getJson: GetJson,
  getReviewCount: (articleVersionDoi: Doi) => number,
): RenderSearchResult => {
  const fetchDisqusPostCount = createFetchDisqusPostCount(getJson);

  return async (result) => {
    const doi = new Doi(result.doi);
    const reviewCount = getReviewCount(doi);

    return `
      <div class="content">
        <a class="header" href="/articles/${result.doi}">${result.title}</a>
        <div class="meta">
          ${result.authorString}
        </div>
        <div class="extra">
          <div class="ui label">
            Reviews
            <span class="detail">${reviewCount}</span>
          </div>
          <div class="ui label">
            Comments
            <span class="detail">${await fetchDisqusPostCount(doi)}</span>
          </div>
        </div>
      </div>
    `;
  };
};
