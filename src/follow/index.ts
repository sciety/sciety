import { Middleware } from '@koa/router';
import { CommitEvents, followCommand, GetFollowList } from './follow-command';
import { GroupId } from '../types/group-id';
import { User } from '../types/user';

type Ports = {
  commitEvents: CommitEvents,
  getFollowList: GetFollowList,
};

export const followHandler = (ports: Ports): Middleware<{ user: User }> => {
  const command = followCommand(
    ports.getFollowList,
    ports.commitEvents,
  );
  return async (context, next) => {
    const groupId = new GroupId(context.request.body.editorialcommunityid);
    const { user } = context.state;
    await command(user, groupId);

    context.redirect('back');

    await next();
  };
};
