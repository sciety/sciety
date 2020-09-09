import { Middleware } from '@koa/router';
import { UserFollowedEditorialCommunityEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type Ports = {
  commitEvents: (event: UserFollowedEditorialCommunityEvent) => Promise<void>;
  getFollowList: (userId: UserId) => Promise<FollowList>;
};

export default (ports: Ports): Middleware<{ user: User }> => (
  async (context, next) => {
    const editorialCommunityId = new EditorialCommunityId(context.request.body.editorialcommunityid);
    const { user } = context.state;
    const followList = await ports.getFollowList(user.id);
    const events = followList.follow(editorialCommunityId);
    events.forEach(async (event) => {
      await ports.commitEvents(event);
    });

    context.redirect('back');

    await next();
  }
);
