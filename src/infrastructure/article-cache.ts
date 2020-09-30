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
    const result = fetchCrossrefArticle(doi);
    cache[doi.value] = result;
    return result;
  };
};
