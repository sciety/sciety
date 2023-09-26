import { Middleware } from 'koa';

export const redirectBack: Middleware = async (context, next) => {
  console.log('>>>>>> start of redirect back');
  context.redirect('back');
  await next();
};
