import { Context, Middleware, Response } from 'koa';
import fetchReviewsForArticlePage, { Review } from '../../../src/article-page/middleware/fetch-reviews-for-article-page';
import Doi from '../../../src/data/doi';
import createEditorialCommunityRepository from '../../../src/data/in-memory-editorial-communities';
import createReviewReferenceRepository from '../../../src/data/in-memory-review-references';
import EditorialCommunityRepository from '../../../src/types/editorial-community-repository';
import createContext from '../../context';
import runMiddleware from '../../middleware';

const editorialCommunities: EditorialCommunityRepository = createEditorialCommunityRepository();

const articleA = new Doi('10.1101/833392');
const articleAReview1 = new Doi('10.5281/zenodo.3678325');

const reviewReferenceRepository = createReviewReferenceRepository();
reviewReferenceRepository.add(articleA, articleAReview1, editorialCommunities.all()[0].id, new Date('2020-05-19T14:00:00Z'));

const makeRequest = async (ctx: Context, next?: Middleware): Promise<Response> => {
  ctx.state = {
    articleDoi: new Doi('10.1101/833392'),
  };
  const fetchReview = async (reviewDoi: Doi): Promise<Review> => ({
    publicationDate: new Date(),
    summary: '',
    doi: reviewDoi,
    editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
  });
  const middleware = fetchReviewsForArticlePage(
    reviewReferenceRepository,
    fetchReview,
    editorialCommunities,
  );
  const { response } = await runMiddleware(middleware, ctx, next);
  return response;
};

describe('fetch-reviews-for-article-page middleware', (): void => {
  it('adds editorial community names to the reviews', async (): Promise<void> => {
    const ctx = createContext();
    await makeRequest(ctx);

    expect(ctx.state.articlePage.reviews[0].editorialCommunityName).toStrictEqual(editorialCommunities.all()[0].name);
  });
});
