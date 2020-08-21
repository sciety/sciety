import { Middleware } from '@koa/router';
import { Logger } from '../infrastructure/logger';
import { UserUnfollowedEditorialCommunityEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';
import { UserId } from '../types/user-id';

type Ports = {
  logger: Logger;
  commitEvent: (event: UserUnfollowedEditorialCommunityEvent) => Promise<void>,
};

export default (ports: Ports): Middleware<{ followList: FollowList, userId: UserId }> => (
  async (context, next) => {
    const editorialCommunityId = new EditorialCommunityId(context.request.body.editorialcommunityid);
    const { followList, userId } = context.state;
    followList.unfollow(editorialCommunityId);
    const event: UserUnfollowedEditorialCommunityEvent = {
      type: 'UserUnfollowedEditorialCommunity',
      date: new Date(),
      userId,
      editorialCommunityId,
    };
    await ports.commitEvent(event);

    ports.logger('info', 'User unfollowed editorial community', { editorialCommunityId });

    context.redirect('back');
    await next();
  }
);
