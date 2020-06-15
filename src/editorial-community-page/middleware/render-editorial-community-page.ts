import { NotFound } from 'http-errors';
import { Context, Middleware, Next } from 'koa';
import { FetchArticle } from '../../api/fetch-article';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import { FetchedArticle } from '../../types/fetched-article';
import createRenderPage from '../render-page';

export default (editorialCommunities: EditorialCommunityRepository, fetchArticle: FetchArticle): Middleware => {
  const renderPage = createRenderPage(fetchArticle);

  return async (ctx: Context, next: Next): Promise<void> => {
    const editorialCommunityId = ctx.state.editorialCommunity.id;
    const editorialCommunity = editorialCommunities.lookup(editorialCommunityId);

    if (editorialCommunity.name === 'Unknown') {
      throw new NotFound(`${editorialCommunityId} not found`);
    }

    const { fetchedArticles } = ctx.state;
    const articles: Array<FetchedArticle> = await fetchedArticles;
    const reviewedArticles = articles.map((article) => ({
      doi: article.doi,
      title: article.title,
    }));

    const viewModel = {
      name: editorialCommunity.name,
      description: editorialCommunity.description,
      logo: editorialCommunity.logo,
      reviewedArticles,
    };

    ctx.response.body = await renderPage(editorialCommunityId, viewModel);

    await next();
  };
};
