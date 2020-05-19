import { Context, Middleware, Next } from 'koa';
import EditorialCommunityRepository from '../types/editorial-community-repository';

export default (
  editorialCommunitiesRepository: EditorialCommunityRepository,
): Middleware => (
  async (ctx: Context, next: Next): Promise<void> => {
    ctx.state.editorialCommunities = editorialCommunitiesRepository.all()
      .reduce((editorialCommunities, editorialCommunity) => ({
        ...editorialCommunities, [editorialCommunity.id]: editorialCommunity,
      }), {});

    await next();
  }
);
