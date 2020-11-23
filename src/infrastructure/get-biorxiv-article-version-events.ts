import { URL } from 'url';
import { Logger } from './logger';
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
  logger: Logger,
): GetBiorxivArticleVersionEvents => (
  async (doi) => {
    const url = `https://api.biorxiv.org/details/biorxiv/${doi.value}`;
    logger('debug', 'Fetching article versions from biorxiv', { url });

    try {
      const biorxivResponse = await getJson(url) as BiorxivResponse;

      logger('debug', 'Retrieved article versions', { biorxivResponse });

      if (biorxivResponse.collection.length === 0) {
        logger('error', 'No article versions found', { doi });
      }

      return biorxivResponse.collection.map((articleDetail) => {
        if (Number.isNaN(Date.parse(articleDetail.date))) {
          throw new Error(`Invalid date received for occurredAt: ${articleDetail.date}`);
        }
        const version = Number.parseInt(articleDetail.version, 10);
        if (Number.isNaN(version)) {
          throw new Error(`Invalid version string received: ${articleDetail.version}`);
        }
        return ({
          source: new URL(`https://www.biorxiv.org/content/${doi.value}v${articleDetail.version}`),
          occurredAt: new Date(articleDetail.date),
          version,
        });
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : undefined;
      logger('error', 'Failed to retrieve article versions', { doi, error, message });
      return [];
    }
  }
);
