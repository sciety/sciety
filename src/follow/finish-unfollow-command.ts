import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from 'koa';
import { Ports, unfollowCommand } from './unfollow-command';
import * as GroupId from '../types/group-id';

export const finishUnfollowCommand = (ports: Ports): Middleware => async (context, next) => {
  if (context.session.command === 'unfollow') {
    await pipe(
      context.session.editorialCommunityId,
      GroupId.fromNullable,
      O.fold(
        () => context.throw(StatusCodes.BAD_REQUEST),
        async (groupId) => {
          const { user } = context.state;
          return unfollowCommand(ports)(user, groupId)();
        },
      ),
    );
  }

  await next();
};
