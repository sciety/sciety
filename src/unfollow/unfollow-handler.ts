import { Middleware } from '@koa/router';
import { Logger } from '../infrastructure/logger';
import { UserUnfollowedEditorialCommunityEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';
import { User } from '../types/user';

type Ports = {
  logger: Logger;
  commitEvent: (event: UserUnfollowedEditorialCommunityEvent) => Promise<void>,
};

export default (ports: Ports): Middleware<{ followList: FollowList, user: User }> => (
  async (context, next) => {
    const editorialCommunityId = new EditorialCommunityId(context.request.body.editorialcommunityid);
    const { followList, user } = context.state;
    followList.unfollow(editorialCommunityId);
    const event: UserUnfollowedEditorialCommunityEvent = {
      type: 'UserUnfollowedEditorialCommunity',
      date: new Date(),
      userId: user.id,
      editorialCommunityId,
    };
    await ports.commitEvent(event);

    ports.logger('info', 'User unfollowed editorial community', { editorialCommunityId });

    context.redirect('back');
    await next();
  }
);
