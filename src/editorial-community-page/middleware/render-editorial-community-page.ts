import { NotFound } from 'http-errors';
import { Context, Middleware, Next } from 'koa';
import Doi from '../../data/doi';
import EditorialCommunityRepository from '../../types/editorial-community-repository';
import { FetchedArticle } from '../../types/fetched-article';
import templateHeader from '../templates/header';
import templateReviewedArticles from '../templates/reviewed-articles';

interface ReviewedArticle {
  doi: Doi;
  title: string;
}

export default (editorialCommunities: EditorialCommunityRepository): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
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

    type RenderPageHeader = () => Promise<string>;

    const createRenderPageHeader = (): RenderPageHeader => (
      async () => Promise.resolve(templateHeader(viewModel))
    );
    const renderPageHeader = createRenderPageHeader();

    ctx.response.body = `
    ${await renderPageHeader()}
    ${templateReviewedArticles(viewModel.reviewedArticles)}
    `;

    await next();
  }
);
