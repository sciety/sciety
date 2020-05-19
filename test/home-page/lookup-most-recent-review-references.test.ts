import { Context, Middleware, Response } from 'koa';
import lookupMostRecentReviewReferences from '../../src/home-page/lookup-most-recent-review-references';
import createContext from '../context';
import runMiddleware from '../middleware';

const invokeMiddleware = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(lookupMostRecentReviewReferences(), ctx, next);
  return response;
};

describe('lookup-most-recent-review-references middleware', (): void => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {};
  });

  it('adds most recent review references to the context', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(ctx.state.mostRecentReviewReferences).toHaveLength(5);
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
