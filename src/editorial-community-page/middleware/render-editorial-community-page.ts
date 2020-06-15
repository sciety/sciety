import { Context, Middleware, Next } from 'koa';
import { FetchArticle } from '../../api/fetch-article';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import ReviewReferenceRepository from '../../types/review-reference-repository';
import createRenderPage from '../render-page';

export default (
  editorialCommunities: EditorialCommunityRepository,
  fetchArticle: FetchArticle,
  reviewReferenceRepository: ReviewReferenceRepository,
): Middleware => {
  const renderPage = createRenderPage(
    fetchArticle,
    reviewReferenceRepository,
    editorialCommunities,
  );

  return async (ctx: Context, next: Next): Promise<void> => {
    ctx.response.body = await renderPage(ctx.state.editorialCommunity.id);

    await next();
  };
};
