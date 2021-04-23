import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { CommitEvents, followCommand, GetFollowList } from './follow-command';
import * as GroupId from '../types/group-id';
import { User } from '../types/user';

export const groupProperty = 'groupid';

type Ports = {
  commitEvents: CommitEvents,
  getFollowList: GetFollowList,
};

export const followHandler = (ports: Ports): Middleware<{ user: User }> => async (context, next) => {
  await pipe(
    context.request.body[groupProperty],
    GroupId.fromNullable,
    O.fold(
      () => context.throw(StatusCodes.BAD_REQUEST),
      async (groupId) => {
        const { user } = context.state;
        context.redirect('back');
        return followCommand(ports.getFollowList, ports.commitEvents)(user, groupId)();
      },
    ),
  );

  await next();
};
