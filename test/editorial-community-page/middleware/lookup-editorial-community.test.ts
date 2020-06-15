import { RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Middleware, Response } from 'koa';
import createEditorialCommunityRepository from '../../../src/data/in-memory-editorial-communities';
import lookupEditorialCommunity from '../../../src/editorial-community-page/middleware/lookup-editorial-community';
import EditorialCommunityRepository from '../../../src/types/editorial-community-repository';
import createContext from '../../context';
import runMiddleware from '../../middleware';

const editorialCommunities: EditorialCommunityRepository = createEditorialCommunityRepository();

const invokeMiddleware = async (ctx: RouterContext, next?: Middleware): Promise<Response> => {
  const { response } = await runMiddleware(lookupEditorialCommunity(editorialCommunities), ctx, next);
  return response;
};

describe('lookup-editorial-community middleware', (): void => {
  let ctx: RouterContext;

  beforeEach(() => {
    ctx = createContext<RouterContext>();
    ctx.params = {};
  });

  describe('when the community exists', (): void => {
    const { id } = editorialCommunities.all()[0];

    beforeEach(() => {
      ctx.params.id = id;
    });

    it('adds the editorial community to the context', async (): Promise<void> => {
      await invokeMiddleware(ctx);

      expect(ctx.state.editorialCommunity.id).toStrictEqual(id);
    });

    it('calls the next middleware', async (): Promise<void> => {
      const next = jest.fn();
      await invokeMiddleware(ctx, next);

      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the editorial community does not exist', (): void => {
    beforeEach(async () => {
      ctx.params.id = 'rubbish';
    });

    it('throws an error', async (): Promise<void> => {
      await expect(invokeMiddleware(ctx)).rejects.toBeInstanceOf(NotFound);
    });

    it('does not add anything to the context', async (): Promise<void> => {
      await invokeMiddleware(ctx).catch(() => {});

      expect(ctx.state.editorialCommunity).toBeUndefined();
    });

    it('does not call the next middleware', async (): Promise<void> => {
      const next = jest.fn();
      await invokeMiddleware(ctx, next).catch(() => {});

      expect(next).not.toHaveBeenCalled();
    });
  });
});
