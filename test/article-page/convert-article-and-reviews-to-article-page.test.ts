import { Context, Middleware, Response } from 'koa';
import convertArticleAndReviewsToArticlePage from '../../src/article-page/convert-article-and-reviews-to-article-page';
import createEditorialCommunityRepository from '../../src/data/in-memory-editorial-communities';
import EditorialCommunityRepository from '../../src/types/editorial-community-repository';
import createContext from '../context';
import runMiddleware from '../middleware';

const editorialCommunities: EditorialCommunityRepository = createEditorialCommunityRepository();

const makeRequest = async (ctx: Context, next?: Middleware): Promise<Response> => {
  ctx.state = {
    article: {},
    reviews: [{
      editorialCommunityId: editorialCommunities.all()[0].id,
    }],
  };
  const { response } = await runMiddleware(convertArticleAndReviewsToArticlePage(editorialCommunities), ctx, next);
  return response;
};

describe('convert-article-and-reviews-to-article-page middleware', (): void => {
  it('adds editorial community names to the reviews', async (): Promise<void> => {
    const ctx = createContext();
    await makeRequest(ctx);

    expect(ctx.state.articlePage.reviews[0].editorialCommunityName).toStrictEqual(editorialCommunities.all()[0].name);
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(createContext(), next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
