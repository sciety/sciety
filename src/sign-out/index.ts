import { Middleware } from 'koa';

export default (): Middleware => (
  async (context, next) => {
    context.logout();
    context.redirect('back');

    await next();
  }
);
