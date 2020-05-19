import { Context, Middleware, Next } from 'koa';
import Doi from '../data/doi';
import ReviewReference from '../types/review-reference';

export default (): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    const mostRecentReviews: Array<ReviewReference> = [
      {
        articleVersionDoi: new Doi('10.1101/642017'),
        reviewDoi: new Doi('10.5281/zenodo.3820276'),
        editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
      },
      {
        articleVersionDoi: new Doi('10.1101/615682'),
        reviewDoi: new Doi('10.5281/zenodo.3820283'),
        editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
      },
      {
        articleVersionDoi: new Doi('10.1101/629618'),
        reviewDoi: new Doi('10.5281/zenodo.3820289'),
        editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
      },
      {
        articleVersionDoi: new Doi('10.1101/600445'),
        reviewDoi: new Doi('10.5281/zenodo.3820295'),
        editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
      },
      {
        articleVersionDoi: new Doi('10.1101/252593'),
        reviewDoi: new Doi('10.5281/zenodo.3820302'),
        editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
      },
    ];

    ctx.state.mostRecentReviews = mostRecentReviews;

    await next();
  }
);
