import { Middleware } from 'koa';

export const logOut: Middleware = async (context, next) => {
  context.logout();
  context.redirect('back');

  await next();
};
