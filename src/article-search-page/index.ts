import { Middleware } from 'koa';
import createRenderPage from './render-page';
import createRenderSearchResult, {
  GetCommentCount,
  GetEndorsingEditorialCommunityNames,
  GetReviewCount,
  RenderSearchResult,
} from './render-search-result';
import createRenderSearchResults from './render-search-results';
import createSearchEuropePmc from './search-europe-pmc';
import { Adapters } from '../types/adapters';
import EndorsementsRepository from '../types/endorsements-repository';

const buildRenderSearchResult = (
  getCommentCount: GetCommentCount,
  getReviewCount: GetReviewCount,
  getEditorialCommunity: (id: string) => Promise<{ name: string }>,
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

export default (adapters: Adapters): Middleware => {
  const getReviewCount: GetReviewCount = async (doi) => (
    (await adapters.reviewReferenceRepository.findReviewsForArticleVersionDoi(doi)).length
  );
  const renderSearchResult = buildRenderSearchResult(
    adapters.getBiorxivCommentCount,
    getReviewCount,
    async (editorialCommunityId) => (await adapters.editorialCommunities.lookup(editorialCommunityId)).unsafelyUnwrap(),
    adapters.endorsements,
  );
  const searchEuropePmc = createSearchEuropePmc(adapters.getJson, adapters.logger);
  const renderSearchResults = createRenderSearchResults(searchEuropePmc, renderSearchResult);

  const renderPage = createRenderPage(renderSearchResults);
  return async (ctx, next) => {
    ctx.response.body = await renderPage(ctx.request.query.query);
    await next();
  };
};
