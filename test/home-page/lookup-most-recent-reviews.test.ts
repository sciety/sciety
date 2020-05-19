import { Context, Middleware, Response } from 'koa';
import lookupMostRecentReviews from '../../src/home-page/lookup-most-recent-reviews';
import createContext from '../context';
import runMiddleware from '../middleware';

const invokeMiddleware = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(lookupMostRecentReviews(), ctx, next);
  return response;
};

describe('lookup-most-recent-reviews middleware', (): void => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {};
  });

  it('adds most recent reviews to the context', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(ctx.state.mostRecentReviews).toHaveLength(5);
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
