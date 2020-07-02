import { Maybe } from 'true-myth';
import createLogger from '../logger';
import Doi from '../types/doi';

export type GetCommentCountForUri = (uri: string) => Promise<Maybe<number>>;

const log = createLogger('infrastructure:get-biorxiv-comment-count');

const resolveToCanonicalUri = (doi: Doi): string => `https://www.biorxiv.org/content/${doi.value}v1`;

export type GetBiorxivCommentCount = (doi: Doi) => Promise<Maybe<number>>;

export default (getCommentCountForUri: GetCommentCountForUri): GetBiorxivCommentCount => (
  async (doi) => {
    const uri = resolveToCanonicalUri(doi);
    log(`Resolved URI = ${uri}`);
    return getCommentCountForUri(uri);
  }
);
