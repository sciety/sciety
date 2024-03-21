import * as O from 'fp-ts/Option';
import { createClient } from 'redis';
import { fetchStaticFile } from './fetch-static-file';
import { getBiorxivOrMedrxivCategory } from './biorxiv/get-biorxiv-or-medrxiv-category';
import { fetchExpressionFrontMatter, crossrefResponseBodyCachePredicate } from './crossref';
import { searchEuropePmc } from './europe-pmc';
import { createFetchRecommendedPapers } from './fetch-recommended-papers';
import { ExternalQueries } from './external-queries';
import { Logger } from '../infrastructure-contract';
import { CachingFetcherOptions, createCachingFetcher } from './cache';
import { fetchPublishingHistory } from './fetch-publishing-history';
import { createFetchEvaluation } from './fetch-evaluation';
import { fetchUserAvatarUrl } from './fetch-user-avatar-url';

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
    fetchEvaluation: createFetchEvaluation(queryExternalService, logger),
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
