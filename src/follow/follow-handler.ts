import { Middleware } from '@koa/router';
import { Logger } from '../infrastructure/logger';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';

type Ports = {
  logger: Logger;
};

export default (ports: Ports): Middleware<{ followList: FollowList }> => (
  async (context, next) => {
    const editorialCommunityId = new EditorialCommunityId(context.request.body.editorialcommunityid);
    const { followList } = context.state;
    followList.follow(editorialCommunityId);

    ports.logger('info', 'User followed editorial community', { editorialCommunityId });

    context.redirect('back');

    await next();
  }
);
