import { Middleware } from 'koa';
import { CommitEvents, createUnfollowCommand, GetFollowList } from './unfollow-command';
import { EditorialCommunityId } from '../types/editorial-community-id';

interface Ports {
  commitEvents: CommitEvents;
  getFollowList: GetFollowList;
}

export const finishUnfollowCommand = (ports: Ports): Middleware => {
  const unfollowCommand = createUnfollowCommand(
    ports.getFollowList,
    ports.commitEvents,
  );
  return async (context, next) => {
    if (context.session.command === 'unfollow' && context.session.editorialCommunityId) {
      const editorialCommunityId = new EditorialCommunityId(context.session.editorialCommunityId);
      const { user } = context.state;
      await unfollowCommand(user, editorialCommunityId);
    }

    await next();
  };
};
