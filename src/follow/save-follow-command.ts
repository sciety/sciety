import { Middleware, ParameterizedContext } from 'koa';

export const saveFollowCommand = (): Middleware => (
  async (context: ParameterizedContext, next) => {
    context.session.command = 'follow';
    context.session.editorialCommunityId = context.request.body.editorialcommunityid;
    await next();
  }
);
