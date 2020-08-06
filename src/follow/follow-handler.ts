import { Middleware } from '@koa/router';
import { Logger } from '../infrastructure/logger';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';

type GetFollowList = () => Promise<FollowList>;

type Ports = {
  getFollowList: GetFollowList;
  logger: Logger;
};

export default (ports: Ports): Middleware => (
  async (context, next) => {
    const editorialCommunityId = new EditorialCommunityId(context.request.body.editorialcommunityid);
    (await ports.getFollowList()).follow(editorialCommunityId);

    ports.logger('info', 'User followed editorial community', { editorialCommunityId });

    context.redirect('/');
    await next();
  }
);
