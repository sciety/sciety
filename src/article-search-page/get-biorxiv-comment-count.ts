import { GetCommentCount } from './render-search-result';
import Doi from '../data/doi';
import createLogger from '../logger';

export type GetCommentCountForUri = (uri: string) => Promise<number>;

const log = createLogger('article-search-page:get-biorxiv-comment-count');

const resolveToCanonicalUri = (doi: Doi): string => `https://www.biorxiv.org/content/${doi.value}v1`;

export default (getCommentCountForUri: GetCommentCountForUri): GetCommentCount => (
  async (doi) => {
    const uri = resolveToCanonicalUri(doi);
    log(`Resolved URI = ${uri}`);
    return getCommentCountForUri(uri);
  }
);
