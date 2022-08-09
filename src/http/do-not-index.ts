import { Middleware } from 'koa';

export const doNotIndex: Middleware = async (context, next) => {
  context.response.set('X-Robots-Tag', 'noindex');
  await next();
};
