import { Context, Middleware, Response } from 'koa';
import populateEditorialCommunities from '../../src/home-page/populate-editorial-communities';
import { EditorialCommunity } from '../../src/types/editorial-community';
import EditorialCommunityRepository from '../../src/types/editorial-community-repository';
import createContext from '../context';
import runMiddleware from '../middleware';
import shouldNotBeCalled from '../should-not-be-called';

const invokeMiddleware = async (
  editorialCommunitiesRepository: EditorialCommunityRepository,
  ctx: Context,
  next?: Middleware,
): Promise<Response> => {
  const { response } = await runMiddleware(populateEditorialCommunities(editorialCommunitiesRepository), ctx, next);
  return response;
};

describe('populate-editorial-communities middleware', (): void => {
  let ctx: Context;
  let editorialCommunitiesRepository: EditorialCommunityRepository;

  beforeEach(() => {
    ctx = createContext();
    ctx.state = {};
    editorialCommunitiesRepository = {
      all: (): Array<EditorialCommunity> => [
        {
          id: 'b560187e-f2fb-4ff9-a861-a204f3fc0fb0',
          name: 'eLife',
          description: 'eLife description',
        },
        {
          id: 'e3a371f9-576d-48d5-a690-731b9fea26bd',
          name: 'Royal Society of Psychoceramics',
          description: 'Royal Society of Psychoceramics description',
        },
      ],
      lookup: shouldNotBeCalled,
    };
  });

  it('adds editorial communities to the context', async (): Promise<void> => {
    await invokeMiddleware(editorialCommunitiesRepository, ctx);

    expect(ctx.state.editorialCommunities).toHaveProperty('b560187e-f2fb-4ff9-a861-a204f3fc0fb0');
    expect(ctx.state.editorialCommunities).toHaveProperty('e3a371f9-576d-48d5-a690-731b9fea26bd');
  });

  it('calls the next middleware', async (): Promise<void> => {
    const next = jest.fn();
    await invokeMiddleware(editorialCommunitiesRepository, ctx, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
