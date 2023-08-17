import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import { createClient } from 'redis';
import {
  buildMemoryStorage, buildStorage, CacheOptions, HeaderInterpreter, StorageValue,
} from 'axios-cache-interceptor';
import { ArticleServer } from '../types/article-server';
import { fetchNcrcReview } from './ncrc/fetch-ncrc-review';
import { fetchRapidReview } from './rapid-reviews/fetch-rapid-review';
import { fetchReview } from './fetch-review';
import { fetchHypothesisAnnotation } from './hypothesis/fetch-hypothesis-annotation';
import { fetchStaticFile } from './fetch-static-file';
import { fetchZenodoRecord } from './zenodo/fetch-zenodo-record';
import { getArticleVersionEventsFromBiorxiv } from './biorxiv';
import { getBiorxivOrMedrxivCategory } from './biorxiv/get-biorxiv-or-medrxiv-category';
import { fetchCrossrefArticle } from './crossref';
import { searchEuropePmc } from './europe-pmc';
import { fetchPrelightsHighlight } from './prelights';
import { fetchRecommendedPapers } from './semantic-scholar/fetch-recommended-papers';
import { Doi } from '../types/doi';
import { QueryExternalService } from './query-external-service';
import { ExternalQueries } from './external-queries';
import { Logger } from '../shared-ports';
import { createCachingFetcher } from './caching-fetcher-factory';
import { shouldCacheCrossrefResponseBody } from './should-cache-crossref-response-body';

const findVersionsForArticleDoiFromSupportedServers = (
  queryExternalService: QueryExternalService,
  logger: Logger,
) => (doi: Doi, server: ArticleServer) => {
  if (server === 'biorxiv' || server === 'medrxiv') {
    return getArticleVersionEventsFromBiorxiv({ queryExternalService, logger })(doi, server);
  }
  return TO.none;
};

const headerInterpreterWithFixedMaxAge = (maxAge: number): HeaderInterpreter => () => maxAge;

const inMemoryCacheOptions = (maxAgeInMilliseconds: number): CacheOptions => ({
  headerInterpreter: headerInterpreterWithFixedMaxAge(maxAgeInMilliseconds),
  storage: buildMemoryStorage(),
});

const redisStorage = (client: ReturnType<typeof createClient>, maxAgeInMilliseconds: number) => buildStorage({
  async find(key) {
    return client
      .get(`axios-cache-${key}`)
      .then((result) => (result ? (JSON.parse(result) as StorageValue) : undefined));
  },

  async set(key, value) {
    await client.set(`axios-cache-${key}`, JSON.stringify(value), {
      PX: maxAgeInMilliseconds,
    });
  },

  async remove(key) {
    await client.del(`axios-cache-${key}`);
  },
});

const redisCacheOptions = (client: ReturnType<typeof createClient>, maxAgeInMilliseconds: number): CacheOptions => ({
  storage: redisStorage(client, maxAgeInMilliseconds),
});

export const instantiate = (
  logger: Logger,
  crossrefApiBearerToken: O.Option<string>,
  redisClient: ReturnType<typeof createClient> | undefined,
): ExternalQueries => {
  const maxAgeInMilliseconds = 24 * 60 * 60 * 1000;
  const cacheOptions = redisClient !== undefined
    ? redisCacheOptions(redisClient, maxAgeInMilliseconds)
    : inMemoryCacheOptions(maxAgeInMilliseconds);
  const queryExternalService = createCachingFetcher(logger, cacheOptions);
  const queryCrossrefService = createCachingFetcher(logger, cacheOptions, shouldCacheCrossrefResponseBody(logger));
  return {
    fetchArticle: fetchCrossrefArticle(queryCrossrefService, logger, crossrefApiBearerToken),
    fetchRelatedArticles: fetchRecommendedPapers(queryExternalService, logger),
    fetchReview: fetchReview({
      doi: fetchZenodoRecord(queryExternalService, logger),
      hypothesis: fetchHypothesisAnnotation(queryExternalService, logger),
      ncrc: fetchNcrcReview(logger),
      prelights: fetchPrelightsHighlight(queryExternalService, logger),
      rapidreviews: fetchRapidReview(queryExternalService, logger),
    }),
    fetchStaticFile: fetchStaticFile(logger),
    searchForArticles: searchEuropePmc(queryExternalService, logger),
    findVersionsForArticleDoi: findVersionsForArticleDoiFromSupportedServers(queryExternalService, logger),
    getArticleSubjectArea: getBiorxivOrMedrxivCategory({ queryExternalService, logger }),
  };
};
