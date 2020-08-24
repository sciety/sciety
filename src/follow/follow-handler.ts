import { Middleware } from '@koa/router';
import { Logger } from '../infrastructure/logger';
import { DomainEvent, UserFollowedEditorialCommunityEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type Ports = {
  logger: Logger;
  commitEvent: (event: DomainEvent) => Promise<void>;
  getFollowList: (userId: UserId) => Promise<FollowList>;
};

export default (ports: Ports): Middleware<{ user: User }> => (
  async (context, next) => {
    const editorialCommunityId = new EditorialCommunityId(context.request.body.editorialcommunityid);
    const { user } = context.state;
    const followList = await ports.getFollowList(user.id);
    followList.follow(editorialCommunityId);
    const event: UserFollowedEditorialCommunityEvent = {
      type: 'UserFollowedEditorialCommunity',
      date: new Date(),
      userId: user.id,
      editorialCommunityId,
    };
    await ports.commitEvent(event);

    ports.logger('info', 'User followed editorial community', { editorialCommunityId, event });

    context.redirect('back');

    await next();
  }
);
