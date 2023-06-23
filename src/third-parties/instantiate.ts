import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
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

const findVersionsForArticleDoiFromSupportedServers = (
  queryExternalService: QueryExternalService,
  logger: Logger,
) => (doi: Doi, server: ArticleServer) => {
  if (server === 'biorxiv' || server === 'medrxiv') {
    return getArticleVersionEventsFromBiorxiv({ queryExternalService, logger })(doi, server);
  }
  return TO.none;
};

export const instantiate = (logger: Logger, crossrefApiBearerToken: O.Option<string>): ExternalQueries => {
  const queryExternalService = createCachingFetcher(logger, 24 * 60 * 60);
  return {
    fetchArticle: fetchCrossrefArticle(queryExternalService, logger, crossrefApiBearerToken),
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
