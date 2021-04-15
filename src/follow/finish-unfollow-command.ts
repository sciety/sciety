import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { CommitEvents, GetFollowList, unfollowCommand } from './unfollow-command';
import * as GroupId from '../types/group-id';

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
    if (context.session.command === 'unfollow') {
      await pipe(
        context.session.editorialCommunityId,
        GroupId.fromNullable,
        O.fold(
          () => context.throw(StatusCodes.BAD_REQUEST),
          async (groupId) => {
            const { user } = context.state;
            return command(user, groupId)();
          },
        ),
      );
    }

    await next();
  };
};
