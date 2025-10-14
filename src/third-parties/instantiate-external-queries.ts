import * as O from 'fp-ts/Option';
import { createClient } from 'redis';
import { CachingFetcherOptions, createCachingFetcher } from './cache';
import { crossrefResponseBodyCachePredicate } from './crossref';
import { searchEuropePmc } from './europe-pmc';
import { ExternalQueries } from './external-queries';
import { fetchBonfireDiscussionId } from './fetch-bonfire-discussion-id';
import { fetchByCategory } from './fetch-by-category';
import { createFetchEvaluationDigest } from './fetch-evaluation-digest';
import { fetchEvaluationHumanReadableOriginalUrl } from './fetch-evaluation-human-readable-original-url';
import { fetchExpressionFrontMatter } from './fetch-expression-front-matter';
import { fetchPublishingHistory } from './fetch-publishing-history';
import { createFetchRecommendedPapers } from './fetch-recommended-papers';
import { fetchSearchCategories } from './fetch-search-categories';
import { fetchStaticFile } from './fetch-static-file';
import { fetchUserAvatarUrl } from './fetch-user-avatar-url';
import { Logger } from '../logger';

const cachingFetcherOptions = (redisClient: ReturnType<typeof createClient> | undefined): CachingFetcherOptions => {
  const maxAgeInMilliseconds = 24 * 60 * 60 * 1000;
  return redisClient !== undefined
    ? {
      tag: 'redis',
      maxAgeInMilliseconds,
      client: redisClient,
    }
    : {
      tag: 'local-memory',
      maxAgeInMilliseconds,
    };
};

export const instantiateExternalQueries = (
  logger: Logger,
  crossrefApiBearerToken: O.Option<string>,
  redisClient: ReturnType<typeof createClient> | undefined,
): ExternalQueries => {
  const queryExternalService = createCachingFetcher(
    logger,
    cachingFetcherOptions(redisClient),
  );
  const queryCrossrefService = createCachingFetcher(
    logger,
    {
      ...cachingFetcherOptions(redisClient),
      responseBodyCachePredicate: crossrefResponseBodyCachePredicate(logger),
    },
  );

  return {
    fetchEvaluationDigest: createFetchEvaluationDigest(queryExternalService, logger),
    fetchEvaluationHumanReadableOriginalUrl: fetchEvaluationHumanReadableOriginalUrl(logger),
    fetchExpressionFrontMatter: fetchExpressionFrontMatter(
      queryCrossrefService,
      logger,
      crossrefApiBearerToken,
    ),
    fetchPublishingHistory: fetchPublishingHistory(
      queryCrossrefService,
      queryExternalService,
      crossrefApiBearerToken,
      logger,
    ),
    fetchRecommendedPapers: createFetchRecommendedPapers(queryExternalService, logger),
    fetchSearchCategories: fetchSearchCategories(queryExternalService, logger),
    fetchByCategory: fetchByCategory(queryExternalService, logger),
    fetchBonfireDiscussionId: fetchBonfireDiscussionId(logger),
    fetchStaticFile: fetchStaticFile(logger),
    fetchUserAvatarUrl: fetchUserAvatarUrl(queryExternalService, logger),
    searchForPaperExpressions: searchEuropePmc(queryExternalService, logger),
  };
};
