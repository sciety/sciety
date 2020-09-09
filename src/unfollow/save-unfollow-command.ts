import { Middleware, ParameterizedContext } from 'koa';

export default (): Middleware => (
  async (context: ParameterizedContext, next) => {
    context.session.command = 'unfollow';
    context.session.editorialCommunityId = context.request.body.editorialcommunityid;
    await next();
  }
);
