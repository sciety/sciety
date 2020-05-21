import { Context, Middleware, Response } from 'koa';
import truncateReviewSummaries from '../../../src/article-page/middleware/truncate-review-summaries';
import createContext from '../../context';
import runMiddleware from '../../middleware';

const makeRequest = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(truncateReviewSummaries(), ctx, next);
  return response;
};

describe('truncate-review-summaries middleware', (): void => {
  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(createContext(), next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
