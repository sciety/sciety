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
  const review1 = new Doi('10.5281/zenodo.5555');
  const review2 = new Doi('10.5281/zenodo.6666');
  const review3 = new Doi('10.5281/zenodo.7777');

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {};
    reviewReferenceRepository = {
      add: shouldNotBeCalled,
      findReviewsForArticleVersionDoi: shouldNotBeCalled,
      findReviewsForEditorialCommunityId: shouldNotBeCalled,
      [Symbol.iterator]: (): IterableIterator<ReviewReference & { added: Date }> => (
        [
          {
            articleVersionDoi: new Doi('10.1101/642017'),
            reviewDoi: review1,
            editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
            added: new Date('2020-05-20T00:00:00Z'),
          },
          {
            articleVersionDoi: new Doi('10.1101/642017'),
            reviewDoi: review3,
            editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
            added: new Date('2020-05-22T00:00:00Z'),
          },
          {
            articleVersionDoi: new Doi('10.1101/615682'),
            reviewDoi: review2,
            editorialCommunityId: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
            added: new Date('2020-05-21T00:00:00Z'),
          },
        ][Symbol.iterator]()
      ),
      orderByAddedDescending: shouldNotBeCalled,
    };
  });
  
  it('adds the most recent review references to the context', async (): Promise<void> => {
    await invokeMiddleware(reviewReferenceRepository, ctx);

    expect(ctx.state.mostRecentReviewReferences).toHaveLength(3);
  });

  it('orders the review references by added date', async (): Promise<void> => {
    await invokeMiddleware(reviewReferenceRepository, ctx);

    const actualReviews = ctx.state.mostRecentReviewReferences
        .map((reviewReference: ReviewReference) => reviewReference.reviewDoi)
        .sort();
    const expectedReviews = [review1, review2, review3];

    expect(actualReviews).toStrictEqual(expectedReviews);
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(reviewReferenceRepository, ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
