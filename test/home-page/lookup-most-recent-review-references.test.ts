import { Context, Middleware, Response } from 'koa';
import Doi from '../../src/data/doi';
import lookupMostRecentReviewReferences from '../../src/home-page/lookup-most-recent-review-references';
import ReviewReference from '../../src/types/review-reference';
import ReviewReferenceRepository from '../../src/types/review-reference-repository';
import createContext from '../context';
import runMiddleware from '../middleware';
import shouldNotBeCalled from '../should-not-be-called';

const invokeMiddleware = async (
  reviewReferenceRepository: ReviewReferenceRepository,
  ctx: Context,
  next?: Middleware,
): Promise<Response> => {
  const { response } = await runMiddleware(lookupMostRecentReviewReferences(reviewReferenceRepository), ctx, next);
  return response;
};

describe('lookup-most-recent-review-references middleware', (): void => {
  let ctx: Context;
  let reviewReferenceRepository: ReviewReferenceRepository;

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {};
    reviewReferenceRepository = {
      add: shouldNotBeCalled,
      findReviewsForArticleVersionDoi: shouldNotBeCalled,
      findReviewsForEditorialCommunityId: shouldNotBeCalled,
      orderByAddedDescending: (): Array<ReviewReference> => [
        {
          articleVersionDoi: new Doi('10.1101/642017'),
          reviewDoi: new Doi('10.5281/zenodo.3833746'),
          editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        },
        {
          articleVersionDoi: new Doi('10.1101/615682'),
          reviewDoi: new Doi('10.5281/zenodo.3833918'),
          editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
        },
      ],
    };
  });

  it('adds most recent review references to the context', async (): Promise<void> => {
    await invokeMiddleware(reviewReferenceRepository, ctx);

    expect(ctx.state.mostRecentReviewReferences).toHaveLength(2);
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(reviewReferenceRepository, ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
