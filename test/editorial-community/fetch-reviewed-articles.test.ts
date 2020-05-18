import { Context, Middleware, Response } from 'koa';
import { FetchArticle } from '../../src/api/fetch-article';
import Doi from '../../src/data/doi';
import fetchReviewedArticles from '../../src/editorial-community-page/fetch-reviewed-articles';
import { FetchedArticle } from '../../src/types/fetched-article';
import createContext from '../context';
import runMiddleware from '../middleware';

const fetchArticle: FetchArticle = async (doi: Doi) => (
  {
    doi,
  } as FetchedArticle
);

const invokeMiddleware = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(fetchReviewedArticles(fetchArticle), ctx, next);
  return response;
};

describe('fetch-reviewed-articles middleware', (): void => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {
      reviewedArticleVersionDois: [
        new Doi('10.1000/1'),
        new Doi('10.99999/2'),
      ],
    };
  });

  it('fetches articles and adds them to the context', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(await ctx.state.fetchedArticles).toHaveLength(2);
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
