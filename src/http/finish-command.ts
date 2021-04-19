import { Middleware } from 'koa';

export const finishCommand: Middleware = async (_context, next) => {
  await next();
};
