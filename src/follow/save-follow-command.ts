import { Middleware } from 'koa';
import { sessionGroupProperty } from './finish-follow-command';
import { groupProperty } from './follow-handler';

export const saveFollowCommand = (): Middleware => (
  async (context, next) => {
    context.session.command = 'follow';
    context.session[sessionGroupProperty] = context.request.body[groupProperty];
    await next();
  }
);
