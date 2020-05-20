import { Context, Middleware, Response } from 'koa';
import Doi from '../../src/data/doi';
import constructViewModel from '../../src/home-page/construct-view-model';
import createContext from '../context';
import runMiddleware from '../middleware';

const invokeMiddleware = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(constructViewModel(), ctx, next);
  return response;
};

describe('construct-view-model middleware', (): void => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {
      editorialCommunities: {
        'b560187e-f2fb-4ff9-a861-a204f3fc0fb0': {
          name: 'eLife',
        },
      },
      fetchedArticles: Promise.resolve({
        '10.1101/642017': {
          title: 'Article 10.1101/642017',
        },
        '10.1101/615682': {
          title: 'Article 10.1101/615682',
        },
      }),
      mostRecentReviewReferences: [
        {
          articleVersionDoi: new Doi('10.1101/642017'),
          editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
          added: new Date('2020-05-20T00:00:00Z'),
        },
        {
          articleVersionDoi: new Doi('10.1101/615682'),
          editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
          added: new Date('2020-05-19T00:00:00Z'),
        },
      ],
    };
  });

  it('adds most recent reviews to the context', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(ctx.state.viewModel.mostRecentReviews).toHaveLength(2);
    expect(ctx.state.viewModel.mostRecentReviews[0]).toMatchObject({
      articleDoi: new Doi('10.1101/642017'),
      articleTitle: 'Article 10.1101/642017',
      editorialCommunityName: 'eLife',
      added: new Date('2020-05-20T00:00:00Z'),
    });
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
