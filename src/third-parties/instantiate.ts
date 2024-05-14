import * as O from 'fp-ts/Option';
import { createClient } from 'redis';
import { getBiorxivOrMedrxivCategory } from './biorxiv/get-biorxiv-or-medrxiv-category';
import { CachingFetcherOptions, createCachingFetcher } from './cache';
import { fetchExpressionFrontMatter, crossrefResponseBodyCachePredicate } from './crossref';
import { searchEuropePmc } from './europe-pmc';
import { ExternalQueries } from './external-queries';
import { createFetchEvaluation } from './fetch-evaluation';
import { fetchEvaluationHumanReadableOriginalUrl } from './fetch-evaluation-human-readable-original-url';
import { fetchPublishingHistory } from './fetch-publishing-history';
import { createFetchRecommendedPapers } from './fetch-recommended-papers';
import { fetchStaticFile } from './fetch-static-file';
import { fetchUserAvatarUrl } from './fetch-user-avatar-url';
import { Logger } from '../shared-ports';

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

export const instantiate = (
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
    fetchEvaluationDigest: createFetchEvaluation(queryExternalService, logger),
    fetchEvaluationHumanReadableOriginalUrl: fetchEvaluationHumanReadableOriginalUrl(
      createFetchEvaluation(queryExternalService, logger),
    ),
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
    fetchStaticFile: fetchStaticFile(logger),
    fetchUserAvatarUrl: fetchUserAvatarUrl(queryExternalService, logger),
    getArticleSubjectArea: getBiorxivOrMedrxivCategory({ queryExternalService, logger }),
    searchForPaperExpressions: searchEuropePmc(queryExternalService, logger),
  };
};
