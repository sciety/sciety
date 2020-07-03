import { Middleware } from '@koa/router';
import createRenderPage, { FetchArticle } from './render-page';
import { GetEditorialCommunities, GetReviewReferences } from './render-recent-activity';
import { Adapters } from '../types/adapters';

const raiseFetchArticleErrors = (fetchArticle: Adapters['fetchArticle']): FetchArticle => (
  async (doi) => {
    const result = await fetchArticle(doi);

    return result.unsafelyUnwrap();
  }
);

export default (adapters: Adapters): Middleware => {
  const reviewReferenceAdapter: GetReviewReferences = async () => Array.from(adapters.reviewReferenceRepository);
  const editorialCommunitiesAdapter: GetEditorialCommunities = async () => adapters.editorialCommunities.all();
  const renderPage = createRenderPage(
    reviewReferenceAdapter,
    raiseFetchArticleErrors(adapters.fetchArticle),
    editorialCommunitiesAdapter,
  );
  return async (ctx, next) => {
    ctx.response.body = await renderPage();
    await next();
  };
};
