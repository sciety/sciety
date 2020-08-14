import createRenderPage from './render-page';
import createRenderSearchResult, {
  GetCommentCount,
  GetEndorsingEditorialCommunityNames,
  GetReviewCount,
  RenderSearchResult,
} from './render-search-result';
import createRenderSearchResults, { FindArticles } from './render-search-results';
import Doi from '../types/doi';
import EditorialCommunityId from '../types/editorial-community-id';
import EditorialCommunityRepository from '../types/editorial-community-repository';
import EndorsementsRepository from '../types/endorsements-repository';
import { ReviewId } from '../types/review-id';
import ReviewReferenceRepository from '../types/review-reference-repository';

type FindReviewsForArticleVersionDoi = (articleVersionDoi: Doi) => Promise<Array<{
  reviewId: ReviewId;
  editorialCommunityId: EditorialCommunityId;
  added: Date;
}>>;

interface Ports {
  getBiorxivCommentCount: GetCommentCount;
  searchEuropePmc: FindArticles,
  editorialCommunities: EditorialCommunityRepository;
  endorsements: EndorsementsRepository,
  reviewReferenceRepository: ReviewReferenceRepository;
  findReviewsForArticleVersionDoi: FindReviewsForArticleVersionDoi;
}

const buildRenderSearchResult = (
  getCommentCount: GetCommentCount,
  getReviewCount: GetReviewCount,
  getEditorialCommunity: (id: EditorialCommunityId) => Promise<{ name: string }>,
  endorsements: EndorsementsRepository,
): RenderSearchResult => {
  const getEndorsingEditorialCommunityNames: GetEndorsingEditorialCommunityNames = async (doi) => {
    const editorialCommunityIds = await endorsements.endorsingEditorialCommunityIds(doi);
    return Promise.all(editorialCommunityIds.map(async (id) => (await getEditorialCommunity(id)).name));
  };
  return createRenderSearchResult(
    getCommentCount,
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
    (await ports.findReviewsForArticleVersionDoi(doi)).length
  );
  const renderSearchResult = buildRenderSearchResult(
    ports.getBiorxivCommentCount,
    getReviewCount,
    async (editorialCommunityId) => (await ports.editorialCommunities.lookup(editorialCommunityId)).unsafelyUnwrap(),
    ports.endorsements,
  );
  const renderSearchResults = createRenderSearchResults(ports.searchEuropePmc, renderSearchResult);

  const renderPage = createRenderPage(renderSearchResults);
  return async (params) => (
    renderPage(params.query ?? '')
  );
};
