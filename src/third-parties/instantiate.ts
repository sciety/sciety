import * as O from 'fp-ts/Option';
import * as TO from 'fp-ts/TaskOption';
import { ArticleServer } from '../types/article-server';
import { fetchNcrcReview } from './ncrc/fetch-ncrc-review';
import { fetchRapidReview } from './rapid-reviews/fetch-rapid-review';
import { fetchReview } from './fetch-review';
import { fetchHypothesisAnnotation } from '../infrastructure/fetch-hypothesis-annotation';
import { fetchStaticFile } from '../infrastructure/fetch-static-file';
import { fetchZenodoRecord } from './zenodo/fetch-zenodo-record';
import { getArticleVersionEventsFromBiorxiv } from './biorxiv';
import { getBiorxivOrMedrxivCategory } from './biorxiv/get-biorxiv-or-medrxiv-category';
import { fetchCrossrefArticle } from './crossref';
import { searchEuropePmc } from './europe-pmc';
import { fetchPrelightsHighlight } from './prelights';
import { fetchRecommendedPapers } from './semantic-scholar/fetch-recommended-papers';
import { Doi } from '../types/doi';
import { queryExternalService } from './query-external-service';
import { ExternalQueries } from './external-queries';
import { Logger } from '../shared-ports';

const findVersionsForArticleDoiFromSupportedServers = (logger: Logger) => (doi: Doi, server: ArticleServer) => {
  if (server === 'biorxiv' || server === 'medrxiv') {
    return getArticleVersionEventsFromBiorxiv({ queryExternalService, logger })(doi, server);
  }
  return TO.none;
};

export const instantiate = (logger: Logger, crossrefApiBearerToken: O.Option<string>): ExternalQueries => ({
  fetchArticle: fetchCrossrefArticle(queryExternalService, logger, crossrefApiBearerToken),
  fetchRelatedArticles: fetchRecommendedPapers(queryExternalService, logger),
  fetchReview: fetchReview({
    doi: fetchZenodoRecord(queryExternalService(logger)),
    hypothesis: fetchHypothesisAnnotation(queryExternalService(logger), logger),
    ncrc: fetchNcrcReview(logger),
    prelights: fetchPrelightsHighlight(logger, queryExternalService(logger)),
    rapidreviews: fetchRapidReview(logger, queryExternalService(logger)),
  }),
  fetchStaticFile: fetchStaticFile(logger),
  searchForArticles: searchEuropePmc(queryExternalService, logger),
  findVersionsForArticleDoi: findVersionsForArticleDoiFromSupportedServers(logger),
  getArticleSubjectArea: getBiorxivOrMedrxivCategory({ queryExternalService, logger }),
});
