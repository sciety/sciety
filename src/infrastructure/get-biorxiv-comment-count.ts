import { Maybe } from 'true-myth';
import { Logger } from './logger';
import Doi from '../types/doi';

export type GetCommentCountForUri = (uri: string) => Promise<Maybe<number>>;

const resolveToCanonicalUri = (doi: Doi): string => `https://www.biorxiv.org/content/${doi.value}v1`;

export type GetBiorxivCommentCount = (doi: Doi) => Promise<Maybe<number>>;

export default (
  getCommentCountForUri: GetCommentCountForUri,
  logger: Logger,
): GetBiorxivCommentCount => (
  async (doi) => {
    const uri = resolveToCanonicalUri(doi);
    logger('debug', `Resolved URI = ${uri}`);
    return getCommentCountForUri(uri);
  }
);
