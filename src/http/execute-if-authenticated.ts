import { Middleware } from 'koa';

export const executeIfAuthenticated = (): Middleware => async (_, next) => {
  await next();
};
