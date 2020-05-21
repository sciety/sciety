import { Context, Middleware, Response } from 'koa';
import truncateReviewSummaries from '../../../src/article-page/middleware/truncate-review-summaries';
import { ReviewViewModel } from '../../../src/article-page/types/article-page-view-model';
import createContext from '../../context';
import runMiddleware from '../../middleware';

const makeRequest = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(truncateReviewSummaries(7), ctx, next);
  return response;
};

describe('truncate-review-summaries middleware', (): void => {
  let context: Context;

  beforeEach(() => {
    context = createContext();
    context.state = {
      articlePage: {
        reviews: [
          {
            summary: 'Summary 1',
          },
          {
            summary: 'Summary 2',
          },
        ],
      },
    };
  });

  it('truncates the review summaries', async (): Promise<void> => {
    await makeRequest(context);
    const actual = context.state.articlePage.reviews.map((review: ReviewViewModel) => review.summary);

    expect(actual).toStrictEqual(['Summary', 'Summary']);
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await makeRequest(context, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
