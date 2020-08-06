import { Middleware } from '@koa/router';

export default (): Middleware => (
  async (context, next) => {
    context.redirect('/');
    await next();
  }
);
