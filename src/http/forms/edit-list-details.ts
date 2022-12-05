import { Middleware } from 'koa';

export const editListDetails: Middleware = async (context, next) => {
  await next();
};
