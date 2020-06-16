import { GetCommentCount } from './render-search-result';
import Doi from '../data/doi';
import createFetchDisqusPostCount from '../infrastructure/fetch-disqus-post-count';
import createLogger from '../logger';

export type GetJson = (uri: string) => Promise<object>;

const log = createLogger('article-search-page:fetch-disqus-post-count');

const resolveToCanonicalUri = (doi: Doi): string => `https://www.biorxiv.org/content/${doi.value}v1`;

export default (getJson: GetJson): GetCommentCount => {
  const fetchDisqusPostCount = createFetchDisqusPostCount(getJson);
  return async (doi) => {
    const uri = resolveToCanonicalUri(doi);
    log(`Resolved URI = ${uri}`);
    return fetchDisqusPostCount(uri);
  };
};
