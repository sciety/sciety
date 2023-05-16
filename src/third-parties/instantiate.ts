import { fetchReview } from '../infrastructure/fetch-review';
import { fetchStaticFile } from '../infrastructure/fetch-static-file';
import { getCachedAxiosRequest } from '../infrastructure/get-cached-axios-request';
import { Logger } from '../infrastructure/logger';
import { getArticleVersionEventsFromBiorxiv } from './biorxiv';
import { fetchCrossrefArticle } from './crossref';
import { searchEuropePmc } from './europe-pmc';
import { ExternalQueries } from './external-queries';
import { fetchRecommendedPapers } from './semantic-scholar/fetch-recommended-papers';

type Dependencies = {
  logger: Logger,
};

export const instantiate = (deps: Dependencies): ExternalQueries => ({
  fetchArticle: fetchCrossrefArticle(
    deps.getCachedAxiosRequest(deps.logger),
    deps.logger,
    deps.crossrefApiBearerToken,
  ),
  fetchRelatedArticles: fetchRecommendedPapers({ deps.getJson, deps.logger }),
  fetchReview: fetchReview(deps.fetchers),
  fetchStaticFile: fetchStaticFile(deps.logger),
  findVersionsForArticleDoi: getArticleVersionEventsFromBiorxiv({
    getJson: getCachedAxiosRequest(deps.logger),
    deps.logger,
  }),
  getArticleSubjectArea: GetArticleSubjectArea,
  searchForArticles: searchEuropePmc({ deps.getJson, deps.logger }),
});
