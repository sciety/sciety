import Doi from '../data/doi';
import createLogger from '../logger';

export type GetCommentCountForUri = (uri: string) => Promise<number>;

const log = createLogger('infrastructure:get-biorxiv-comment-count');

const resolveToCanonicalUri = (doi: Doi): string => `https://www.biorxiv.org/content/${doi.value}v1`;

export type GetBiorxivCommentCount = (doi: Doi) => Promise<number>;

export default (getCommentCountForUri: GetCommentCountForUri): GetBiorxivCommentCount => (
  async (doi) => {
    const uri = resolveToCanonicalUri(doi);
    log(`Resolved URI = ${uri}`);
    return getCommentCountForUri(uri);
  }
);
