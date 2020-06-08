import axios, { AxiosResponse } from 'axios';
import createLogger from '../logger';

export type GetJson = (uri: string) => Promise<object>;

interface SearchResult {
  doi: string;
  title: string;
  authorString: string;
}

const log = createLogger('article-search-page:render-search-result');

const resolveToCanonicalUri = (doi: string): string => `https://www.biorxiv.org/content/${doi}v1`;

type FetchDisqusPostCount = (uri: string) => Promise<string>;

const createFetchDisqusPostCount = (): FetchDisqusPostCount => (
  async (uri) => {
    let disqusResponse: AxiosResponse;

    try {
      disqusResponse = await axios.get(`https://disqus.com/api/3.0/threads/list.json?api_key=${process.env.DISQUS_API_KEY}&forum=biorxivstage&thread=link:${uri}`);
    } catch (e) {
      log(`Disqus API error: ${e.message}`);

      return 'n/a';
    }

    log(`Disqus response: ${JSON.stringify(disqusResponse.data)}`);

    return `${disqusResponse.data.response[0].posts}`;
  }
);

type RenderSearchResult = (result: SearchResult) => Promise<string>;

export default (): RenderSearchResult => {
  const fetchDisqusPostCount = createFetchDisqusPostCount();

  return async (result) => {
    const uri = resolveToCanonicalUri(result.doi);
    log(`Resolved URI = ${uri}`);

    return `
      <div class="content">
        <a class="header" href="/articles/${result.doi}">${result.title}</a>
        <div class="meta">
          ${result.authorString}
        </div>
        <div class="extra">
          <div class="ui label">
            Comments
            <span class="detail">${await fetchDisqusPostCount(uri)}</span>
          </div>
        </div>
      </div>
    `;
  };
};
