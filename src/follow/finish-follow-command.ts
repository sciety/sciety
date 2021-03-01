import { Middleware } from 'koa';
import { CommitEvents, followCommand, GetFollowList } from './follow-command';
import { EditorialCommunityId } from '../types/editorial-community-id';

type Ports = {
  commitEvents: CommitEvents,
  getFollowList: GetFollowList,
};

export const finishFollowCommand = (ports: Ports): Middleware => {
  const command = followCommand(
    ports.getFollowList,
    ports.commitEvents,
  );
  return async (context, next) => {
    if (context.session.command === 'follow' && context.session.editorialCommunityId) {
      const editorialCommunityId = new EditorialCommunityId(context.session.editorialCommunityId);
      await command(context.state.user, editorialCommunityId);
      delete context.session.command;
      delete context.session.editorialCommunityId;
    }

    await next();
  };
};
