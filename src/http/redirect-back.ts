import { Middleware } from 'koa';

export const redirectBack: Middleware = async (context, next) => {
  context.redirect('back');
  await next();
};
