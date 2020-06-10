import { GetCommentCount } from './render-search-result';
import Doi from '../data/doi';
import createLogger from '../logger';

export type GetJson = (uri: string) => Promise<object>;

const log = createLogger('article-search-page:fetch-disqus-post-count');

const resolveToCanonicalUri = (doi: Doi): string => `https://www.biorxiv.org/content/${doi.value}v1`;

interface DisqusData {
  response: Array< {posts: number} >;
}

export default (getJson: GetJson): GetCommentCount => (
  async (doi) => {
    const uri = resolveToCanonicalUri(doi);
    log(`Resolved URI = ${uri}`);
    try {
      const disqusData = await getJson(`https://disqus.com/api/3.0/threads/list.json?api_key=${process.env.DISQUS_API_KEY}&forum=biorxivstage&thread=link:${uri}`) as DisqusData;
      log(`Disqus response: ${JSON.stringify(disqusData)}`);

      return disqusData.response[0].posts;
    } catch (e) {
      log(`Disqus API error: ${e.message}`);

      throw e;
    }
  }
);
