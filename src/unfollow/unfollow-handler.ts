import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { CommitEvents, GetFollowList, unfollowCommand } from './unfollow-command';
import * as GroupId from '../types/group-id';
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
    await pipe(
      context.request.body.editorialcommunityid,
      GroupId.fromString,
      O.fold(
        () => context.throw(StatusCodes.BAD_REQUEST),
        async (groupId) => {
          const { user } = context.state;
          context.redirect('back');
          return command(user, groupId)();
        },
      ),
    );

    await next();
  };
};
