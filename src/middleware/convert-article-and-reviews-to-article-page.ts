import { Middleware, RouterContext } from '@koa/router';
import { Next } from 'koa';
import editorialCommunities from '../data/editorial-communities';
import { ArticlePage } from '../templates/article-page';

export default (): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    const [article, reviews] = await Promise.all([
      ctx.state.article,
      ctx.state.reviews,
    ]);

    ctx.state.articlePage = {
      article,
      reviews: reviews.map((review: object) => ({
        ...review,
        editorialCommunityId: editorialCommunities[0].id,
        editorialCommunityName: editorialCommunities[0].name,
      })),
    } as ArticlePage;

    await next();
  }
);
