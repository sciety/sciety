import { Middleware } from 'koa';
import { CommitEvents, GetFollowList, unfollowCommand } from './unfollow-command';
import { GroupId } from '../types/group-id';

type Ports = {
  commitEvents: CommitEvents,
  getFollowList: GetFollowList,
};

export const finishUnfollowCommand = (ports: Ports): Middleware => {
  const command = unfollowCommand(
    ports.getFollowList,
    ports.commitEvents,
  );
  return async (context, next) => {
    if (context.session.command === 'unfollow' && context.session.editorialCommunityId) {
      const editorialCommunityId = new GroupId(context.session.editorialCommunityId);
      const { user } = context.state;
      await command(user, editorialCommunityId);
    }

    await next();
  };
};
