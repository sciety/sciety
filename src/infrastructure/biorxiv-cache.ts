import { GetArticleVersionEventsFromBiorxiv } from './get-article-version-events-from-biorxiv';
import { Logger } from './logger';

type BiorxivCache = Record<string, ReturnType<GetArticleVersionEventsFromBiorxiv>>;

export default (
  getArticleVersionEventsFromBiorxiv: GetArticleVersionEventsFromBiorxiv,
  logger: Logger,
): GetArticleVersionEventsFromBiorxiv => {
  const cache: BiorxivCache = {};
  return async (doi, server) => {
    const cached = cache[doi.value];
    if (cached !== undefined) {
      logger('debug', 'bioRxiv cache hit', { doi });
      return cached;
    }
    logger('debug', 'bioRxiv cache miss', { doi });
    const promise = getArticleVersionEventsFromBiorxiv(doi, server);
    void promise.then((result) => {
      if (result.length === 0) {
        delete cache[doi.value];
      }
    });
    cache[doi.value] = promise;
    return promise;
  };
};
