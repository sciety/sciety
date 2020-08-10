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
    const followList = await ports.getFollowList();
    followList.unfollow(editorialCommunityId);
    context.cookies.set(
      'followList',
      JSON.stringify(followList.getContents().map((item) => item.value)),
    );

    ports.logger('info', 'User unfollowed editorial community', { editorialCommunityId });

    context.redirect('back');
    await next();
  }
);
