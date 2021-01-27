import { GetBiorxivArticleVersionEvents } from './get-biorxiv-article-version-events';
import { Logger } from './logger';

type BiorxivCache = Record<string, ReturnType<GetBiorxivArticleVersionEvents>>;

export default (
  getBiorxivArticleVersionEvents: GetBiorxivArticleVersionEvents,
  logger: Logger,
): GetBiorxivArticleVersionEvents => {
  const cache: BiorxivCache = {};
  return async (doi, server) => {
    const cached = cache[doi.value];
    if (cached !== undefined) {
      logger('debug', 'bioRxiv cache hit', { doi });
      return cached;
    }
    logger('debug', 'bioRxiv cache miss', { doi });
    const promise = getBiorxivArticleVersionEvents(doi, server);
    void promise.then((result) => {
      if (result.length === 0) {
        delete cache[doi.value];
      }
    });
    cache[doi.value] = promise;
    return promise;
  };
};
