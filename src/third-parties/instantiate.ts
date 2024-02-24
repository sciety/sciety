import * as O from 'fp-ts/Option';
import { createClient } from 'redis';
import { fetchNcrcReview } from './ncrc/fetch-ncrc-review.js';
import { fetchRapidReview } from './rapid-reviews/fetch-rapid-review.js';
import { fetchEvaluation } from './fetch-evaluation.js';
import { fetchHypothesisAnnotation } from './hypothesis/fetch-hypothesis-annotation.js';
import { fetchStaticFile } from './fetch-static-file.js';
import { fetchZenodoRecord } from './zenodo/fetch-zenodo-record.js';
import { getBiorxivOrMedrxivCategory } from './biorxiv/get-biorxiv-or-medrxiv-category.js';
import { fetchExpressionFrontMatter, crossrefResponseBodyCachePredicate } from './crossref/index.js';
import { searchEuropePmc } from './europe-pmc/index.js';
import { fetchPrelightsHighlight } from './prelights/index.js';
import { fetchRecommendedPapers } from './sciety-labs/index.js';
import { ExternalQueries } from './external-queries.js';
import { Logger } from '../infrastructure/index.js';
import { CachingFetcherOptions, createCachingFetcher } from './cache/index.js';
import { fetchDoiEvaluationByPublisher } from './fetch-doi-evaluation-by-publisher.js';
import { fetchAccessMicrobiologyEvaluation } from './access-microbiology/fetch-access-microbiology-evaluation.js';
import { fetchPublishingHistory } from './fetch-publishing-history.js';

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
    fetchEvaluation: fetchEvaluation({
      doi: fetchDoiEvaluationByPublisher(
        {
          // eslint-disable-next-line quote-props
          '10.5281': fetchZenodoRecord(queryExternalService, logger),
          // eslint-disable-next-line quote-props
          '10.1099': fetchAccessMicrobiologyEvaluation(queryExternalService, logger),
        },
        logger,
      ),
      hypothesis: fetchHypothesisAnnotation(queryExternalService, logger),
      ncrc: fetchNcrcReview(logger),
      prelights: fetchPrelightsHighlight(queryExternalService, logger),
      rapidreviews: fetchRapidReview(queryExternalService, logger),
    }),
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
