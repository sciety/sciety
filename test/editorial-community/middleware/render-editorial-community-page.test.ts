import { Context, Middleware, Response } from 'koa';
import Doi from '../../../src/data/doi';
import renderEditorialCommunityPage from '../../../src/editorial-community-page/middleware/render-editorial-community-page';
import createContext from '../../context';
import runMiddleware from '../../middleware';
import shouldNotBeCalled from '../../should-not-be-called';

const repository = {
  lookup: () => ({
    id: '',
    name: 'community-name',
    logo: undefined,
    description: 'community-description',
  }),
  all: shouldNotBeCalled,
};

const invokeMiddleware = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(renderEditorialCommunityPage(repository), ctx, next);
  return response;
};

describe('render-editorial-community-page middleware', (): void => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {
      editorialCommunity: {
        name: 'community-name',
        description: 'community-description',
      },
      fetchedArticles: Promise.resolve([{
        doi: new Doi('10.1111/1111'),
        title: 'title-1',
      },
      {
        doi: new Doi('10.2222/2222'),
        title: 'title-2',
      }]),
    };
  });

  it('renders the editorial community name', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(ctx.response.body).toStrictEqual(expect.stringContaining('community-name'));
  });

  it('renders the editorial community description', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(ctx.response.body).toStrictEqual(expect.stringContaining('community-description'));
  });

  it('renders the article links', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(ctx.response.body).toStrictEqual(expect.stringContaining('10.1111/1111'));
    expect(ctx.response.body).toStrictEqual(expect.stringContaining('title-1'));
    expect(ctx.response.body).toStrictEqual(expect.stringContaining('10.2222/2222'));
    expect(ctx.response.body).toStrictEqual(expect.stringContaining('title-2'));
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
