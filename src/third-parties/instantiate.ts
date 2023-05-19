import * as O from 'fp-ts/Option';
import { Json } from 'fp-ts/Json';
import { EvaluationFetcher, fetchReview } from '../infrastructure/fetch-review';
import { fetchStaticFile } from '../infrastructure/fetch-static-file';
import { getCachedAxiosRequest } from '../infrastructure/get-cached-axios-request';
import { Logger } from '../infrastructure/logger';
import { getArticleVersionEventsFromBiorxiv } from './biorxiv';
import { fetchCrossrefArticle } from './crossref';
import { searchEuropePmc } from './europe-pmc';
import { ExternalQueries } from './external-queries';
import { fetchRecommendedPapers } from './semantic-scholar/fetch-recommended-papers';
import { getBiorxivOrMedrxivCategory } from './biorxiv/get-biorxiv-or-medrxiv-category';
import { fetchData } from '../infrastructure/fetchers';

const createGetJsonWithTimeout = (logger: Logger, timeout: number) => async (uri: string) => {
  const response = await fetchData(logger, timeout)<Json>(uri);
  return response.data;
};

type Dependencies = {
  getJson: (uri: string) => Promise<Json>,
  logger: Logger,
  fetchers: Record<string, EvaluationFetcher>,
  crossrefApiBearerToken: O.Option<string>,
};

export const instantiate = (deps: Dependencies): ExternalQueries => ({
  fetchArticle: fetchCrossrefArticle(
    getCachedAxiosRequest(deps.logger),
    deps.logger,
    deps.crossrefApiBearerToken,
  ),
  fetchRelatedArticles: fetchRecommendedPapers(deps),
  fetchReview: fetchReview(deps.fetchers),
  fetchStaticFile: fetchStaticFile(deps.logger),
  findVersionsForArticleDoi: getArticleVersionEventsFromBiorxiv({
    getJson: getCachedAxiosRequest(deps.logger),
    logger: deps.logger,
  }),
  getArticleSubjectArea: getBiorxivOrMedrxivCategory({
    getJson: createGetJsonWithTimeout(deps.logger, 10000),
    logger: deps.logger,
  }),
  searchForArticles: searchEuropePmc(deps),
});
