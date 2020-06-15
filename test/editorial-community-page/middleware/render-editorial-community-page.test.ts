import { Context, Middleware, Response } from 'koa';
import { FetchArticle } from '../../../src/api/fetch-article';
import Doi from '../../../src/data/doi';
import createReviewReferenceRepository from '../../../src/data/in-memory-review-references';
import renderEditorialCommunityPage from '../../../src/editorial-community-page/middleware/render-editorial-community-page';
import ReviewReferenceRepository from '../../../src/types/review-reference-repository';
import createContext from '../../context';
import runMiddleware from '../../middleware';
import shouldNotBeCalled from '../../should-not-be-called';

const repository = {
  lookup: () => ({
    id: 'some-id',
    name: 'community-name',
    logo: undefined,
    description: 'community-description',
  }),
  all: shouldNotBeCalled,
};

const fetchArticle: FetchArticle = async (doi) => (
  {
    title: 'some title',
    doi,
    publicationDate: new Date(),
    abstract: '',
    authors: [],
  }
);

const article1 = new Doi('10.1111/1111');
const article2 = new Doi('10.2222/2222');
const editorialCommunityId = 'some-id';

const reviewReferenceRepository: ReviewReferenceRepository = createReviewReferenceRepository();
reviewReferenceRepository.add(article1, new Doi('10.5555/1'), editorialCommunityId, new Date('2020-05-19T14:00:00Z'));
reviewReferenceRepository.add(article2, new Doi('10.6666/2'), editorialCommunityId, new Date('2020-05-19T14:00:00Z'));
reviewReferenceRepository.add(article2, new Doi('10.7777/3'), editorialCommunityId, new Date('2020-05-19T14:00:00Z'));
reviewReferenceRepository.add(article2, new Doi('10.8888/4'), 'another-community', new Date('2020-05-19T14:00:00Z'));

const invokeMiddleware = async (ctx: Context, next?: Middleware): Promise<Response> => {
  const middleware = renderEditorialCommunityPage(repository, fetchArticle, reviewReferenceRepository);
  const { response } = await runMiddleware(middleware, ctx, next);
  return response;
};

describe('render-editorial-community-page middleware', (): void => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {
      editorialCommunity: {
        id: 'some-id',
        name: 'community-name',
        description: 'community-description',
      },
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
    expect(ctx.response.body).toStrictEqual(expect.stringContaining('some title'));
    expect(ctx.response.body).toStrictEqual(expect.stringContaining('10.2222/2222'));
    expect(ctx.response.body).toStrictEqual(expect.stringContaining('some title'));
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
