import { Context, Middleware, Response } from 'koa';
import Doi from '../../src/data/doi';
import createReviewReferenceRepository from '../../src/data/in-memory-review-references';
import lookupReviewedArticles from '../../src/editorial-community-page/lookup-reviewed-articles';
import { EditorialCommunity } from '../../src/types/editorial-community';
import ReviewReferenceRepository from '../../src/types/review-reference-repository';
import createContext from '../context';
import runMiddleware from '../middleware';

const article1 = new Doi('10.1000/1');
const article2 = new Doi('10.99999/2');
const editorialCommunityId = 'some-id';

const reviewReferenceRepository: ReviewReferenceRepository = createReviewReferenceRepository();
reviewReferenceRepository.add(article1, new Doi('10.5555/1'), editorialCommunityId, new Date('2020-05-19T14:00:00Z'));
reviewReferenceRepository.add(article2, new Doi('10.6666/2'), editorialCommunityId, new Date('2020-05-19T14:00:00Z'));
reviewReferenceRepository.add(article2, new Doi('10.7777/3'), editorialCommunityId, new Date('2020-05-19T14:00:00Z'));
reviewReferenceRepository.add(article2, new Doi('10.8888/4'), 'another-community', new Date('2020-05-19T14:00:00Z'));

const invokeMiddleware = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(lookupReviewedArticles(reviewReferenceRepository), ctx, next);
  return response;
};

describe('lookup-reviewed-articles middleware', (): void => {
  let ctx: Context;
  const editorialCommunity: Partial<EditorialCommunity> = {
    id: editorialCommunityId,
  };

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {
      editorialCommunity,
    };
  });

  it('adds the unique article DOIs reviewed by the editorial community to the context', async (): Promise<void> => {
    await invokeMiddleware(ctx);

    expect(ctx.state.reviewedArticleVersionDois).toStrictEqual([article1, article2]);
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
