import { URL } from 'url';
import Doi from '../types/doi';
import { Json, JsonCompatible } from '../types/json';

export type GetJson = (url: string) => Promise<Json>;

type BiorxivResponse = JsonCompatible<{
  collection: ReadonlyArray<{
    date: string;
    version: string;
  }>
}>;

export type GetBiorxivArticleVersionEvents = (doi: Doi) => Promise<ReadonlyArray<{
  source: URL;
  occurredAt: Date;
  version: number;
}>>;

export default (
  getJson: GetJson,
): GetBiorxivArticleVersionEvents => (
  async (doi) => {
    const biorxivResponse = await getJson(`https://api.biorxiv.org/details/biorxiv/${doi.value}`) as BiorxivResponse;

    return biorxivResponse.collection.map((articleDetail) => ({
      source: new URL(`https://www.biorxiv.org/content/${doi.value}v${articleDetail.version}`),
      occurredAt: new Date(articleDetail.date),
      version: Number.parseInt(articleDetail.version, 10),
    }));
  }
);
