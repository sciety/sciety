import { Middleware } from '@koa/router';
import createUnfollowCommand, { CommitEvents, GetFollowList } from './unfollow-command';
import EditorialCommunityId from '../types/editorial-community-id';
import { User } from '../types/user';

type Ports = {
  commitEvents: CommitEvents,
  getFollowList: GetFollowList,
};

export default (ports: Ports): Middleware<{ user: User }> => {
  const unfollowCommand = createUnfollowCommand(
    ports.getFollowList,
    ports.commitEvents,
  );
  return async (context, next) => {
    const editorialCommunityId = new EditorialCommunityId(context.request.body.editorialcommunityid);
    const { user } = context.state;
    await unfollowCommand(user, editorialCommunityId);

    context.redirect('back');

    await next();
  };
};
