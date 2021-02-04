import { Middleware } from 'koa';

export const saveFollowCommand = (): Middleware => (
  async (context, next) => {
    context.session.command = 'follow';
    context.session.editorialCommunityId = context.request.body.editorialcommunityid;
    await next();
  }
);
