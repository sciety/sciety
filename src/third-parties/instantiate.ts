import * as O from 'fp-ts/Option';
import { Json } from 'fp-ts/Json';
import { fetchReview } from '../infrastructure/fetch-review';
import { fetchStaticFile } from '../infrastructure/fetch-static-file';
import { getCachedAxiosRequest } from '../infrastructure/get-cached-axios-request';
import { Logger } from '../infrastructure/logger';
import { getArticleVersionEventsFromBiorxiv, getBiorxivOrMedrxivCategory } from './biorxiv';
import { fetchCrossrefArticle } from './crossref';
import { searchEuropePmc } from './europe-pmc';
import { ExternalQueries } from './external-queries';
import { fetchRecommendedPapers } from './semantic-scholar/fetch-recommended-papers';
import { fetchData } from '../infrastructure/fetchers';
import { fetchHypothesisAnnotation } from './hypothesis';
import { fetchNcrcReview } from '../infrastructure/fetch-ncrc-review';
import { fetchRapidReview } from '../infrastructure/fetch-rapid-review';
import { fetchZenodoRecord } from '../infrastructure/fetch-zenodo-record';
import { getHtml } from '../infrastructure/get-html';
import { fetchPrelightsHighlight } from './prelights';

const getJsonWithTimeout = (logger: Logger, timeout: number) => async (uri: string) => {
  const response = await fetchData(logger, timeout)<Json>(uri);
  return response.data;
};

type Dependencies = {
  getJson: (uri: string) => Promise<Json>,
  logger: Logger,
  crossrefApiBearerToken: O.Option<string>,
};

export const instantiate = (deps: Dependencies): ExternalQueries => ({
  fetchArticle: fetchCrossrefArticle(
    getCachedAxiosRequest(deps.logger),
    deps.logger,
    deps.crossrefApiBearerToken,
  ),
  fetchRelatedArticles: fetchRecommendedPapers(deps),
  fetchReview: fetchReview({
    doi: fetchZenodoRecord(deps.getJson, deps.logger),
    hypothesis: fetchHypothesisAnnotation(getCachedAxiosRequest(deps.logger, 5 * 60 * 1000), deps.logger),
    ncrc: fetchNcrcReview(deps.logger),
    prelights: fetchPrelightsHighlight(getHtml(deps.logger)),
    rapidreviews: fetchRapidReview(deps.logger, getHtml(deps.logger)),
  }),
  fetchStaticFile: fetchStaticFile(deps.logger),
  findVersionsForArticleDoi: getArticleVersionEventsFromBiorxiv({
    getJson: getCachedAxiosRequest(deps.logger),
    logger: deps.logger,
  }),
  getArticleSubjectArea: getBiorxivOrMedrxivCategory({
    getJson: getJsonWithTimeout(deps.logger, 10000),
    logger: deps.logger,
  }),
  searchForArticles: searchEuropePmc(deps),
});
