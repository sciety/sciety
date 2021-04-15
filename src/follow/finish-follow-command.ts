import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { CommitEvents, followCommand, GetFollowList } from './follow-command';
import * as GroupId from '../types/group-id';

export const sessionGroupProperty = 'groupId';

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
    if (context.session.command === 'follow') {
      await pipe(
        context.session[sessionGroupProperty],
        GroupId.fromNullable,
        O.fold(
          () => context.throw(StatusCodes.BAD_REQUEST),
          async (groupId) => {
            const { user } = context.state;
            return command(user, groupId)();
          },
        ),
      );

      delete context.session.command;
      delete context.session.editorialCommunityId;
    }

    await next();
  };
};
