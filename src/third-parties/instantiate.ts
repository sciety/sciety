import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import { createClient } from 'redis';
import { ArticleServer } from '../types/article-server.js';
import { fetchNcrcReview } from './ncrc/fetch-ncrc-review.js';
import { fetchRapidReview } from './rapid-reviews/fetch-rapid-review.js';
import { fetchReview } from './fetch-review.js';
import { fetchHypothesisAnnotation } from './hypothesis/fetch-hypothesis-annotation.js';
import { fetchStaticFile } from './fetch-static-file.js';
import { fetchZenodoRecord } from './zenodo/fetch-zenodo-record.js';
import { getArticleVersionEventsFromBiorxiv } from './biorxiv/index.js';
import { getBiorxivOrMedrxivCategory } from './biorxiv/get-biorxiv-or-medrxiv-category.js';
import { fetchCrossrefArticle } from './crossref/index.js';
import { searchEuropePmc } from './europe-pmc/index.js';
import { fetchPrelightsHighlight } from './prelights/index.js';
import { fetchRecommendedPapers } from './semantic-scholar/fetch-recommended-papers.js';
import { ArticleId } from '../types/article-id.js';
import { QueryExternalService } from './query-external-service.js';
import { ExternalQueries } from './external-queries.js';
import { Logger } from '../shared-ports/index.js';
import { CachingFetcherOptions, createCachingFetcher } from './caching-fetcher-factory.js';
import { crossrefResponseBodyCachePredicate } from './crossref-response-body-cache-predicate.js';
import { fetchDoiEvaluationByPublisher } from './fetch-doi-evaluation-by-publisher.js';
import { fetchAccessMicrobiologyEvaluation } from './access-microbiology/fetch-access-microbiology-evaluation.js';

const findVersionsForArticleDoiFromSupportedServers = (
  queryExternalService: QueryExternalService,
  logger: Logger,
) => (doi: ArticleId, server: ArticleServer) => {
  if (server === 'biorxiv' || server === 'medrxiv') {
    return getArticleVersionEventsFromBiorxiv({ queryExternalService, logger })(doi, server);
  }
  return TO.none;
};

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
    fetchArticle: fetchCrossrefArticle(queryCrossrefService, logger, crossrefApiBearerToken),
    fetchRelatedArticles: fetchRecommendedPapers(queryExternalService, logger),
    fetchReview: fetchReview({
      doi: fetchDoiEvaluationByPublisher(
        {
          // eslint-disable-next-line quote-props
          '10.5281': fetchZenodoRecord(queryExternalService, logger),
          // eslint-disable-next-line quote-props
          '10.1099': fetchAccessMicrobiologyEvaluation(logger),
        },
        logger,
      ),
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
