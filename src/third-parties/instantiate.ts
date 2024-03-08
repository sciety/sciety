import * as O from 'fp-ts/Option';
import { createClient } from 'redis';
import { fetchStaticFile } from './fetch-static-file';
import { getBiorxivOrMedrxivCategory } from './biorxiv/get-biorxiv-or-medrxiv-category';
import { fetchExpressionFrontMatter, crossrefResponseBodyCachePredicate } from './crossref';
import { searchEuropePmc } from './europe-pmc';
import { fetchRecommendedPapers } from './fetch-recommended-papers';
import { ExternalQueries } from './external-queries';
import { Logger } from '../shared-ports';
import { CachingFetcherOptions, createCachingFetcher } from './cache';
import { fetchPublishingHistory } from './fetch-publishing-history';
import { createFetchEvaluation } from './fetch-evaluation';

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
    fetchExpressionFrontMatter: fetchExpressionFrontMatter(
      queryCrossrefService,
      logger,
      crossrefApiBearerToken,
    ),
    fetchRecommendedPapers: fetchRecommendedPapers(queryExternalService, logger),
    fetchEvaluation: createFetchEvaluation(queryExternalService, logger),
    fetchStaticFile: fetchStaticFile(logger),
    searchForPaperExpressions: searchEuropePmc(queryExternalService, logger),
    fetchPublishingHistory: fetchPublishingHistory(
      queryCrossrefService,
      queryExternalService,
      crossrefApiBearerToken,
      logger,
    ),
    getArticleSubjectArea: getBiorxivOrMedrxivCategory({ queryExternalService, logger }),
  };
};
