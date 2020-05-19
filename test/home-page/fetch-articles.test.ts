import { Context, Middleware, Response } from 'koa';
import { FetchArticle } from '../../src/api/fetch-article';
import Doi from '../../src/data/doi';
import fetchArticles from '../../src/home-page/fetch-articles';
import { FetchedArticle } from '../../src/types/fetched-article';
import createContext from '../context';
import runMiddleware from '../middleware';

const invokeMiddleware = async (
  fetchArticle: FetchArticle,
  ctx: Context,
  next?: Middleware,
): Promise<Response> => {
  const { response } = await runMiddleware(fetchArticles(fetchArticle), ctx, next);
  return response;
};

const fetchArticle: FetchArticle = async (doi: Doi) => (
  {
    doi,
  } as FetchedArticle
);

describe('fetch-articles middleware', (): void => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {
      mostRecentReviews: [
        {
          articleVersionDoi: new Doi('10.1101/642017'),
          reviewDoi: new Doi('10.5281/zenodo.3820276'),
        },
        {
          articleVersionDoi: new Doi('10.1101/615682'),
          reviewDoi: new Doi('10.5281/zenodo.3820283'),
        },
      ],
    };
  });

  it('adds fetched articles to the context', async (): Promise<void> => {
    await invokeMiddleware(fetchArticle, ctx);

    expect(await ctx.state.fetchedArticles).toHaveProperty(['10.1101/642017']);
    expect(await ctx.state.fetchedArticles).toHaveProperty(['10.1101/615682']);
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(fetchArticle, ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
