import { Middleware } from '@koa/router';
import { CommitEvents, GetFollowList, unfollowCommand } from './unfollow-command';
import { GroupId } from '../types/editorial-community-id';
import { User } from '../types/user';

type Ports = {
  commitEvents: CommitEvents,
  getFollowList: GetFollowList,
};

export const unfollowHandler = (ports: Ports): Middleware<{ user: User }> => {
  const command = unfollowCommand(
    ports.getFollowList,
    ports.commitEvents,
  );
  return async (context, next) => {
    const editorialCommunityId = new GroupId(context.request.body.editorialcommunityid);
    const { user } = context.state;
    await command(user, editorialCommunityId);

    context.redirect('back');

    await next();
  };
};
