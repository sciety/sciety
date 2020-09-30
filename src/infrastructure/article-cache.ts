import { FetchCrossrefArticle } from './fetch-crossref-article';

type ArticleCache = Record<string, ReturnType<FetchCrossrefArticle>>;

export default (
  fetchCrossrefArticle: FetchCrossrefArticle,
): FetchCrossrefArticle => {
  const cache: ArticleCache = {};
  return async (doi) => {
    const cached = cache[doi.value];
    if (cached !== undefined) {
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
