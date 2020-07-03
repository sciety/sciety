import { Middleware } from 'koa';
import createGetHardCodedEndorsingEditorialCommunities from './hard-coded-endorsing-editorial-communities';
import createRenderPage from './render-page';
import createRenderSearchResult, { GetCommentCount, GetReviewCount, RenderSearchResult } from './render-search-result';
import createRenderSearchResults, { RenderSearchResults } from './render-search-results';
import createSearchEuropePmc from './search-europe-pmc';
import { Adapters } from '../types/adapters';
import { Json } from '../types/json';

type GetJson = (uri: string) => Promise<Json>;

const buildRenderSearchResult = (
  getCommentCount: GetCommentCount,
  getReviewCount: GetReviewCount,
  getEditorialCommunity: (id: string) => Promise<{ name: string }>,
): RenderSearchResult => {
  const getEndorsingEditorialCommunities = createGetHardCodedEndorsingEditorialCommunities(
    async (id) => (await getEditorialCommunity(id)).name,
  );
  return createRenderSearchResult(
    getCommentCount,
    getReviewCount,
    getEndorsingEditorialCommunities,
  );
};

const buildRenderSearchResults = (
  getJson: GetJson,
  renderSearchResult: RenderSearchResult,
): RenderSearchResults => {
  const findArticles = createSearchEuropePmc(getJson);
  return createRenderSearchResults(findArticles, renderSearchResult);
};

export default (adapters: Adapters): Middleware => {
  const getReviewCount: GetReviewCount = async (doi) => (
    (await adapters.reviewReferenceRepository.findReviewsForArticleVersionDoi(doi)).length
  );
  const renderSearchResult = buildRenderSearchResult(
    adapters.getBiorxivCommentCount,
    getReviewCount,
    async (editorialCommunityId) => (await adapters.editorialCommunities.lookup(editorialCommunityId)).unsafelyUnwrap(),
  );
  const renderSearchResults = buildRenderSearchResults(adapters.getJson, renderSearchResult);

  const renderPage = createRenderPage(renderSearchResults);
  return async (ctx, next) => {
    ctx.response.body = await renderPage(ctx.request.query.query);
    await next();
  };
};
