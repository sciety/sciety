import { URL } from 'url';
import { GetFeedEvents } from './get-feed-events-content';
import { Json, JsonCompatible } from '../types/json';

export type GetJson = (url: string) => Promise<Json>;

type BiorxivResponse = JsonCompatible<{
  collection: ReadonlyArray<{
    date: string;
    version: string;
  }>
}>;

export default (
  getJson: GetJson,
): GetFeedEvents => (
  async (doi) => {
    const biorxivResponse = await getJson(`https://api.biorxiv.org/details/biorxiv/${doi.value}`) as BiorxivResponse;

    return biorxivResponse.collection.map((articleDetail) => ({
      type: 'article-version',
      source: new URL(`https://www.biorxiv.org/content/${doi.value}v${articleDetail.version}`),
      postedAt: new Date(articleDetail.date),
      version: Number.parseInt(articleDetail.version, 10),
    }));
  }
);
