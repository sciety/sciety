import { NotFound } from 'http-errors';
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
  const renderPage = createRenderPage(fetchArticle, reviewReferenceRepository);

  return async (ctx: Context, next: Next): Promise<void> => {
    const editorialCommunityId = ctx.state.editorialCommunity.id;
    const editorialCommunity = editorialCommunities.lookup(editorialCommunityId);

    if (editorialCommunity.name === 'Unknown') {
      throw new NotFound(`${editorialCommunityId} not found`);
    }

    const viewModel = {
      name: editorialCommunity.name,
      description: editorialCommunity.description,
      logo: editorialCommunity.logo,
    };

    ctx.response.body = await renderPage(editorialCommunityId, viewModel);

    await next();
  };
};
