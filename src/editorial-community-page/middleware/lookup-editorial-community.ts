import { Middleware, RouterContext } from '@koa/router';
import { NotFound } from 'http-errors';
import { Next } from 'koa';
import EditorialCommunityRepository from '../../types/editorial-community-repository';

export default (
  editorialCommunities: EditorialCommunityRepository,
): Middleware => (
  async (ctx: RouterContext, next: Next): Promise<void> => {
    const editorialCommunityId = ctx.params.id;
    const editorialCommunity = editorialCommunities.lookup(editorialCommunityId);

    if (editorialCommunity.name === 'Unknown') {
      throw new NotFound(`${editorialCommunityId} not found`);
    }

    ctx.state.editorialCommunity = editorialCommunity;

    await next();
  }
);
