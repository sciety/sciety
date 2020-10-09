import { Maybe } from 'true-myth';
import createRenderPage from './render-page';
import createRenderSearchResult, {
  GetEndorsingEditorialCommunityNames,
  GetReviewCount,
  RenderSearchResult,
} from './render-search-result';
import createRenderSearchResults, { FindArticles } from './render-search-results';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import EndorsementsRepository from '../types/endorsements-repository';
import { ReviewId } from '../types/review-id';

type FindReviewsForArticleDoi = (articleDoi: Doi) => Promise<ReadonlyArray<{
  reviewId: ReviewId;
  editorialCommunityId: EditorialCommunityId;
}>>;

type GetEditorialCommunity = (editorialCommunityId: EditorialCommunityId) => Promise<Maybe<{
  name: string;
}>>;

interface Ports {
  searchEuropePmc: FindArticles,
  getEditorialCommunity: GetEditorialCommunity,
  endorsements: EndorsementsRepository,
  findReviewsForArticleDoi: FindReviewsForArticleDoi;
}

const buildRenderSearchResult = (
  getReviewCount: GetReviewCount,
  getEditorialCommunity: (id: EditorialCommunityId) => Promise<{ name: string }>,
  endorsements: EndorsementsRepository,
): RenderSearchResult => {
  const getEndorsingEditorialCommunityNames: GetEndorsingEditorialCommunityNames = async (doi) => {
    const editorialCommunityIds = await endorsements.endorsingEditorialCommunityIds(doi);
    return Promise.all(editorialCommunityIds.map(async (id) => (await getEditorialCommunity(id)).name));
  };
  return createRenderSearchResult(
    getReviewCount,
    getEndorsingEditorialCommunityNames,
  );
};

interface Params {
  query?: string;
}

type RenderPage = (params: Params) => Promise<string>;

export default (ports: Ports): RenderPage => {
  const getReviewCount: GetReviewCount = async (doi) => (
    (await ports.findReviewsForArticleDoi(doi)).length
  );
  const renderSearchResult = buildRenderSearchResult(
    getReviewCount,
    async (editorialCommunityId) => (await ports.getEditorialCommunity(editorialCommunityId)).unsafelyUnwrap(),
    ports.endorsements,
  );
  const renderSearchResults = createRenderSearchResults(ports.searchEuropePmc, renderSearchResult);

  const renderPage = createRenderPage(renderSearchResults);
  return async (params) => (
    renderPage(params.query ?? '')
  );
};
