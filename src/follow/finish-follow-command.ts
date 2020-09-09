import { Middleware, ParameterizedContext } from 'koa';
import { UserFollowedEditorialCommunityEvent } from '../types/domain-events';
import EditorialCommunityId from '../types/editorial-community-id';
import FollowList from '../types/follow-list';
import { User } from '../types/user';
import { UserId } from '../types/user-id';

type CommitEvents = (events: ReadonlyArray<UserFollowedEditorialCommunityEvent>) => Promise<void>;
type GetFollowList = (userId: UserId) => Promise<FollowList>;

interface Ports {
  commitEvents: CommitEvents;
  getFollowList: GetFollowList;
}

const createFollowCommand = (
  getFollowList: GetFollowList,
  commitEvents: CommitEvents,
) => (
  async (user: User, editorialCommunityId: EditorialCommunityId) => {
    const followList = await getFollowList(user.id);
    const events = followList.follow(editorialCommunityId);
    await commitEvents(events);
  }
);

export default (ports: Ports): Middleware => (
  async (context: ParameterizedContext, next) => {
    if (context.session.command === 'follow' && context.session.editorialCommunityId) {
      const followCommand = createFollowCommand(
        ports.getFollowList,
        ports.commitEvents,
      );
      await followCommand(context.state.user, context.session.editorialCommunityId);
    }

    await next();
  }
);
