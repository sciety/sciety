import { Middleware } from 'koa';
import { groupProperty } from './follow-handler';

export const saveFollowCommand = (): Middleware => (
  async (context, next) => {
    context.session.command = 'follow';
    context.session.editorialCommunityId = context.request.body[groupProperty];
    await next();
  }
);
