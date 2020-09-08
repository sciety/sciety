import { Middleware, ParameterizedContext } from 'koa';
import { UserFollowedEditorialCommunityEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';
import { UserId } from '../types/user-id';

type CommitEvent = (event: UserFollowedEditorialCommunityEvent) => Promise<void>;
type GetFollowList = (userId: UserId) => Promise<FollowList>;

interface Ports {
  commitEvent: CommitEvent;
  getFollowList: GetFollowList;
}

export default (ports: Ports): Middleware => (
  async (context: ParameterizedContext, next) => {
    if (context.session.editorialCommunityId) {
      const editorialCommunityId = new EditorialCommunityId(context.session.editorialCommunityId);
      const { user } = context.state;
      const followList = await ports.getFollowList(user.id);
      const events = followList.follow(editorialCommunityId);
      await ports.commitEvent(events[0]);
    }

    await next();
  }
);
