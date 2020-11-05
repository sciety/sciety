import createRenderPage, { RenderPage } from './render-page';
import createRenderSearchResult, { GetReviewCount } from './render-search-result';
import createRenderSearchResults, { FindArticles } from './render-search-results';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import { ReviewId } from '../types/review-id';

type FindReviewsForArticleDoi = (articleDoi: Doi) => Promise<ReadonlyArray<{
  reviewId: ReviewId;
  editorialCommunityId: EditorialCommunityId;
}>>;

interface Ports {
  searchEuropePmc: FindArticles,
  findReviewsForArticleDoi: FindReviewsForArticleDoi;
}

interface Params {
  query?: string;
}

type ArticleSearchPage = (params: Params) => ReturnType<RenderPage>;

export default (ports: Ports): ArticleSearchPage => {
  const getReviewCount: GetReviewCount = async (doi) => (
    (await ports.findReviewsForArticleDoi(doi)).length
  );
  const renderSearchResult = createRenderSearchResult(getReviewCount);
  const renderSearchResults = createRenderSearchResults(ports.searchEuropePmc, renderSearchResult);

  const renderPage = createRenderPage(renderSearchResults);
  return async (params) => (
    renderPage(params.query ?? '')
  );
};
