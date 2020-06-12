import { Context, Middleware, Response } from 'koa';
import Doi from '../../../src/data/doi';
import constructViewModel from '../../../src/editorial-community-page/middleware/construct-view-model';
import { FetchedArticle } from '../../../src/types/fetched-article';
import createContext from '../../context';
import runMiddleware from '../../middleware';

const article1: FetchedArticle = {
  doi: new Doi('10.1111/2'),
  title: 'article-1',
  publicationDate: new Date(),
  abstract: 'abstract-1',
  authors: [],
};

const article2: FetchedArticle = {
  doi: new Doi('10.2222/2'),
  title: 'article-2',
  publicationDate: new Date(),
  abstract: 'abstract-2',
  authors: [],
};

const invokeMiddleware = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(constructViewModel(), ctx, next);
  return response;
};

describe('construct-view-model middleware', (): void => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {
      editorialCommunity: {
        name: 'community-name',
        description: 'community-description',
      },
      fetchedArticles: [article1, article2],
    };
  });

  it('adds the editorial community name to the context', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(ctx.state.viewModel.name).toStrictEqual('community-name');
  });

  it('adds the editorial community description to the context', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(ctx.state.viewModel.description).toStrictEqual('community-description');
  });

  it('adds the reviewed articles to the context', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(ctx.state.viewModel.reviewedArticles[0].doi).toStrictEqual(article1.doi);
    expect(ctx.state.viewModel.reviewedArticles[0].title).toStrictEqual(article1.title);
    expect(ctx.state.viewModel.reviewedArticles[1].doi).toStrictEqual(article2.doi);
    expect(ctx.state.viewModel.reviewedArticles[1].title).toStrictEqual(article2.title);
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
