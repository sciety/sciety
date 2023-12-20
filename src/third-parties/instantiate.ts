import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import { createClient } from 'redis';
import { ArticleServer } from '../types/article-server';
import { fetchNcrcReview } from './ncrc/fetch-ncrc-review';
import { fetchRapidReview } from './rapid-reviews/fetch-rapid-review';
import { fetchReview } from './fetch-review';
import { fetchHypothesisAnnotation } from './hypothesis/fetch-hypothesis-annotation';
import { fetchStaticFile } from './fetch-static-file';
import { fetchZenodoRecord } from './zenodo/fetch-zenodo-record';
import { getArticleVersionEventsFromBiorxiv } from './biorxiv';
import { getBiorxivOrMedrxivCategory } from './biorxiv/get-biorxiv-or-medrxiv-category';
import { fetchAllPaperExpressionsFromCrossref, fetchCrossrefArticle } from './crossref';
import { searchEuropePmc } from './europe-pmc';
import { fetchPrelightsHighlight } from './prelights';
import { fetchRecommendedPapers } from './semantic-scholar/fetch-recommended-papers';
import { QueryExternalService } from './query-external-service';
import { ExternalQueries } from './external-queries';
import { Logger } from '../shared-ports';
import { CachingFetcherOptions, createCachingFetcher } from './caching-fetcher-factory';
import { crossrefResponseBodyCachePredicate } from './crossref-response-body-cache-predicate';
import { fetchDoiEvaluationByPublisher } from './fetch-doi-evaluation-by-publisher';
import { fetchAccessMicrobiologyEvaluation } from './access-microbiology/fetch-access-microbiology-evaluation';
import { fetchPaperExpressionFrontMatterFromCrossref } from './crossref/fetch-crossref-article';
import { ExpressionDoi } from '../types/expression-doi';
import { ArticleId } from '../types/article-id';

const findVersionsForArticleDoiFromSupportedServers = (
  queryCrossrefService: QueryExternalService,
  queryExternalService: QueryExternalService,
  crossrefApiBearerToken: O.Option<string>,
  logger: Logger,
) => (expressionDoi: ExpressionDoi, server: ArticleServer) => {
  if (server === 'biorxiv' || server === 'medrxiv') {
    return getArticleVersionEventsFromBiorxiv({ queryExternalService, logger })(new ArticleId(expressionDoi), server);
  }
  if (server === 'accessmicrobiology' || process.env.EXPERIMENT_ENABLED === 'true') {
    const headers: Record<string, string> = { };
    if (O.isSome(crossrefApiBearerToken)) {
      headers['Crossref-Plus-API-Token'] = `Bearer ${crossrefApiBearerToken.value}`;
    }
    return fetchAllPaperExpressionsFromCrossref(
      queryCrossrefService(undefined, headers),
      logger,
      expressionDoi,
    );
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
    fetchPaperExpressionFrontMatter: fetchPaperExpressionFrontMatterFromCrossref(
      queryCrossrefService,
      logger,
      crossrefApiBearerToken,
    ),
    fetchRecommendedPapers: fetchRecommendedPapers(queryExternalService, logger),
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
    searchForPaperExpressions: searchEuropePmc(queryExternalService, logger),
    findAllExpressionsOfPaper: findVersionsForArticleDoiFromSupportedServers(
      queryCrossrefService,
      queryExternalService,
      crossrefApiBearerToken,
      logger,
    ),
    getArticleSubjectArea: getBiorxivOrMedrxivCategory({ queryExternalService, logger }),
  };
};
