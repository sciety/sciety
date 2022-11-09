import { Middleware } from 'koa';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const removeArticleFromListFromForm = (adapters: unknown): Middleware => async (context, next) => {
  await next();
};
