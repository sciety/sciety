import { Middleware } from 'koa';

export const saveUnfollowCommand = (): Middleware => (
  async (context, next) => {
    context.session.command = 'unfollow';
    context.session.editorialCommunityId = context.request.body.editorialcommunityid;
    await next();
  }
);
