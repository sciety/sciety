import { Middleware } from '@koa/router';
import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Ports, unfollowCommand } from './unfollow-command';
import * as GroupId from '../types/group-id';

export const unfollowHandler = (ports: Ports): Middleware => async (context, next) => {
  await pipe(
    context.request.body.editorialcommunityid,
    GroupId.fromNullable,
    O.fold(
      () => context.throw(StatusCodes.BAD_REQUEST),
      async (groupId) => {
        const { user } = context.state;
        context.redirect('back');
        return unfollowCommand(ports)(user, groupId)();
      },
    ),
  );

  await next();
};
