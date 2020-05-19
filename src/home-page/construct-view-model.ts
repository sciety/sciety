import { Context, Middleware, Next } from 'koa';
import Doi from '../data/doi';

export default (): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const { editorialCommunities } = ctx.state;
    const fetchedArticles = await ctx.state.fetchedArticles;

    ctx.state.viewModel = {
      mostRecentReviews: [
        {
          articleDoi: new Doi('10.1101/642017'),
          articleTitle: fetchedArticles['10.1101/642017'].title,
          editorialCommunityName: editorialCommunities['b560187e-f2fb-4ff9-a861-a204f3fc0fb0'].name,
        },
        {
          articleDoi: new Doi('10.1101/615682'),
          articleTitle: fetchedArticles['10.1101/615682'].title,
          editorialCommunityName: editorialCommunities['b560187e-f2fb-4ff9-a861-a204f3fc0fb0'].name,
        },
        {
          articleDoi: new Doi('10.1101/629618'),
          articleTitle: fetchedArticles['10.1101/629618'].title,
          editorialCommunityName: editorialCommunities['b560187e-f2fb-4ff9-a861-a204f3fc0fb0'].name,
        },
        {
          articleDoi: new Doi('10.1101/600445'),
          articleTitle: fetchedArticles['10.1101/600445'].title,
          editorialCommunityName: editorialCommunities['b560187e-f2fb-4ff9-a861-a204f3fc0fb0'].name,
        },
        {
          articleDoi: new Doi('10.1101/252593'),
          articleTitle: fetchedArticles['10.1101/252593'].title,
          editorialCommunityName: editorialCommunities['b560187e-f2fb-4ff9-a861-a204f3fc0fb0'].name,
        },
      ],
    };

    await next();
  }
);
