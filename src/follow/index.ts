import { Middleware } from '@koa/router';
import { CommitEvents, createFollowCommand, GetFollowList } from './follow-command';
import { EditorialCommunityId } from '../types/editorial-community-id';
import { User } from '../types/user';

interface Ports {
  commitEvents: CommitEvents,
  getFollowList: GetFollowList,
}

export const followHandler = (ports: Ports): Middleware<{ user: User }> => {
  const followCommand = createFollowCommand(
    ports.getFollowList,
    ports.commitEvents,
  );
  return async (context, next) => {
    const editorialCommunityId = new EditorialCommunityId(context.request.body.editorialcommunityid);
    const { user } = context.state;
    await followCommand(user, editorialCommunityId);

    context.redirect('back');

    await next();
  };
};
