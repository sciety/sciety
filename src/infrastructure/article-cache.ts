import { FetchCrossrefArticle } from './fetch-crossref-article';
import { Logger } from './logger';

type ArticleCache = Record<string, ReturnType<FetchCrossrefArticle>>;

export default (
  fetchCrossrefArticle: FetchCrossrefArticle,
  logger: Logger,
): FetchCrossrefArticle => {
  const cache: ArticleCache = {};
  return async (doi) => {
    const cached = cache[doi.value];
    if (cached !== undefined) {
      logger('debug', 'Article cache hit', { doi });
      return cached;
    }
    const promise = fetchCrossrefArticle(doi);
    void promise.then((result) => {
      if (result.isErr()) {
        delete cache[doi.value];
      }
    });
    cache[doi.value] = promise;
    return promise;
  };
};
