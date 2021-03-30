import * as O from 'fp-ts/Option';
import { pipe } from 'fp-ts/function';
import { Middleware } from 'koa';
import { sessionGroupProperty } from './finish-follow-command';
import { groupProperty } from './follow-handler';
import * as GroupId from '../types/group-id';

export const saveFollowCommand = (): Middleware => (
  async (context, next) => {
    pipe(
      context.request.body[groupProperty],
      O.fromNullable,
      O.chain(GroupId.fromString),
      O.chainFirst((groupId) => {
        // TODO: this side-effect could be captured differently
        context.session.command = 'follow';
        context.session[sessionGroupProperty] = groupId.toString();
        return O.some('ok');
      }),
    );

    await next();
  }
);
